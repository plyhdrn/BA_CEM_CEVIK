import sqlite3 from "sqlite3";
import escapeStringRegexp from "escape-string-regexp";
import { isValid, parse } from "date-fns";
import { UTCDateMini } from "@date-fns/utc";
import Bescha from "../BESCHA/Bescha.js";
import Ted from "../TED/Ted.js";
import Matching from "./Matching.js";
import { ObjectId } from "mongoose";
import { logMatchingSuccess, logUpdate } from "../util/logger.js";

export const isValidExtension = (fileName: string): boolean => {
  const allowedExtensions = ["db"];
  const fileExtension = fileName.split(".").pop();
  return (
    fileExtension !== undefined && allowedExtensions.includes(fileExtension)
  );
};

async function runQueryWithParams(db: any, query: any, params: any[] = []) {
  return new Promise(function (resolve, reject) {
    db.run(query, params, function (err: any) {
      if (err) {
        console.log(err);

        return reject(err);
      }
    });

    resolve(true);
  });
}

async function runQuery(db: any, query: any) {
  return new Promise(function (resolve, reject) {
    db.all(query, function (err: any, rows: any) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

const createIdColumn = async (db: sqlite3.Database) => {
  const addLocalId = `alter table tender add pocodat_localId TEXT;`;
  const addExternalId = `alter table tender add pocodat_externalId TEXT;`;
  const addSource = `alter table tender add pocodat_source TEXT;`;
  await runQuery(db, addLocalId);
  await runQuery(db, addExternalId);
  await runQuery(db, addSource);
};

const matcher = async (
  db: sqlite3.Database,
  loggerId: ObjectId
): Promise<{
  totalEntries: number;
  matchedTedEntries: number;
  matchedBeschaEntries: number;
}> => {
  const selectQuery = `select name,creation_date,ext_tender_id,creator from tender`;
  const rows = (await runQuery(db, selectQuery)) as {
    name: string;
    creation_date: string;
    ext_tender_id: string;
    creator: string;
  }[];
  const tenderIds = rows.map((row) => {
    return {
      name: row.name,
      creation_date: row.creation_date,
      ext_tender_id: row.ext_tender_id,
      creator: row.creator,
    };
  });

  let matchedTedEntries = 0;
  let matchedBeschaEntries = 0;
  let totalEntries = 0;

  for await (const tenderId of tenderIds) {
    const andQuery: any[] = [
      {
        "releases.tender.title": tenderId.name,
      },
    ];

    if (tenderId.creation_date) {
      const date = parse(
        tenderId.creation_date.slice(0, 10),
        "dd.MM.yyyy",
        new Date()
      );
      if (isValid(date)) {
        andQuery.push({
          publishedDate: new UTCDateMini(date).toISOString(),
        });
      }
    }

    const beschaMatcher: any = await Bescha.findOne({
      $or: [
        {
          "releases.tender.documents.url": new RegExp(
            `${escapeStringRegexp(tenderId.ext_tender_id)}$`
          ),
        },
        {
          $and: andQuery,
        },
      ],
    });

    if (beschaMatcher) {
      matchedBeschaEntries++;
      const insertQuery = `UPDATE tender SET pocodat_localId = ?, pocodat_externalId = ?, pocodat_source = ?  WHERE ext_tender_id = ?`;
      await runQueryWithParams(db, insertQuery, [
        beschaMatcher._id.toString(),
        beschaMatcher.releases[0].id,
        "bescha",
        tenderId.ext_tender_id,
      ]);
    } else {
      const tedMatcher: any = await Ted.findOne({
        $or: [
          {
            "BT-22-Procedure": tenderId.ext_tender_id,
          },
          {
            $and: [
              {
                "title-proc.deu": new RegExp(
                  `^${escapeStringRegexp(tenderId.name)}`
                ),
              },
              {
                "title-proc.deu": tenderId.name,
              },
            ],
          },
        ],
      });

      if (tedMatcher) {
        matchedTedEntries++;
        const insertQuery = `UPDATE tender SET pocodat_localId = ?, pocodat_externalId = ?, pocodat_source = ?  WHERE ext_tender_id = ?`;
        await runQueryWithParams(db, insertQuery, [
          tedMatcher._id.toString(),
          tedMatcher["publication-number"],
          "ted",
          tenderId.ext_tender_id,
        ]);
      }
    }
    totalEntries++;
    await logUpdate(
      loggerId,
      `Processed ${totalEntries} out of ${tenderIds.length}`
    );
    console.log(
      `Processed ${totalEntries} out of ${tenderIds.length} Count: ${matchedBeschaEntries + matchedTedEntries}`
    );
  }

  return {
    totalEntries,
    matchedTedEntries,
    matchedBeschaEntries,
  };
};

export const startMatching = async (
  tempFileName: string,
  fileName: string,
  loggerId: ObjectId
) => {
  let db;
  try {
    db = new sqlite3.Database(
      `./src/Matching/matches/${tempFileName}`,
      (err) => {
        if (err) {
          throw new Error(err.message);
        }
        console.log("Connected to the in-memory SQLite database.");
      }
    );

    await createIdColumn(db);

    await logUpdate(loggerId, "Creating ID column in the database");

    const { totalEntries, matchedTedEntries, matchedBeschaEntries } =
      await matcher(db, loggerId);

    // const insertQuery = `UPDATE tender SET pocodat_id = ? WHERE ext_tender_id = ?`;
    // const alterQuery = `DELETE FROM tender WHERE creator <> ?`;
    // await runQuery(db, alterQuery);
    // await runQueryWithParams(db, alterQuery, ["LBM Trier"]);
    // await runQuery2(db, insertQuery, ["123", "458700"]);
    const selectQuery = `select * from tender where pocodat_localId is not null;`;
    const rows = await runQuery(db, selectQuery);
    console.log(rows);
    // Close the DB connection
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Closed the database connection.");
    });

    await logUpdate(loggerId, "Saving the results in the database");

    const result = {
      name: fileName,
      outputFile: tempFileName,
      totalEntries,
      matchedTedEntries,
      matchedBeschaEntries,
      data: rows,
    };

    const matchingObj = await Matching.create(result);

    await logMatchingSuccess(loggerId, matchingObj._id);

    return result;
  } catch (e) {
    console.log(e);
    if (db) {
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Closed the database connection.");
      });
    }
    throw new Error("Error while running the query");
  }
};
