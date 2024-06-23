import mongoose from "mongoose";

export const createBeschaMeta = async (): Promise<void> => {
  await mongoose.connection.db.dropCollection("beschaMeta");
  await mongoose.connection.db.createCollection("beschaMeta", {
    viewOn: "beschas",
    pipeline: [
      {
        $unwind: "$releases",
      },
      {
        $project: {
          entryId: "$releases.id",
          source: "bescha",
          publishDate: "$releases.date",
          title: {
            $toString: "$releases.tender.title",
          },
          description: {
            $toString: "$releases.tender.description",
          },
          amount: "$releases.tender.value",
          buyers: [
            {
              name: {
                $ifNull: ["$releases.buyer.name", "$$REMOVE"],
              },
              address: {
                $ifNull: [
                  {
                    $concat: [
                      "$releases.buyer.address.streetAddress",
                      "\n",
                      "$releases.buyer.address.locality",
                      " ",
                      "$releases.buyer.address.postalCode",
                      "\n",
                      "$releases.buyer.address.countryName",
                    ],
                  },
                  "$$REMOVE",
                ],
              },
              country: {
                $ifNull: ["$releases.buyer.address.countryName", "$$REMOVE"],
              },
              url: {
                $ifNull: [
                  {
                    $cond: [
                      {
                        $ne: ["$releases.buyer.contactPoint.url", null],
                      },
                      "$releases.buyer.contactPoint.url",
                      {
                        $cond: [
                          {
                            $regexMatch: {
                              input: "$releases.buyer.contactPoint.email",
                              regex: RegExp(
                                '^(?:[a-zA-Z0-9])([-_0-9a-zA-Z]+(\\.[-_0-9a-zA-Z]+)*|^\\"([\\001-\\010\\013\\014\\016-\\037!#-\\[\\]-\\177]|\\\\[\\001-011\\013\\014\\016-\\177])*\\")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}\\.?$'
                              ),
                            },
                          },
                          {
                            $let: {
                              vars: {
                                locality: {
                                  $split: [
                                    "$releases.buyer.contactPoint.email",
                                    "@",
                                  ],
                                },
                              },
                              in: {
                                $arrayElemAt: ["$$locality", -1],
                              },
                            },
                          },
                          null,
                        ],
                      },
                    ],
                  },
                  "$$REMOVE",
                ],
              },
              contact: {
                email: {
                  $ifNull: ["$releases.buyer.contactPoint.email", "$$REMOVE"],
                },
                phone: {
                  $ifNull: [
                    "$releases.buyer.contactPoint.telephone",
                    "$$REMOVE",
                  ],
                },
              },
            },
          ],
          sellers: {
            $map: {
              input: {
                $filter: {
                  input: "$releases.parties",
                  as: "party",
                  cond: {
                    $and: [
                      {
                        $ne: ["$$party.roles", []],
                      },
                      {
                        $ne: ["$releases.parties.roles", []],
                      },
                      {
                        $ne: ["$$party.roles", null],
                      },
                      {
                        $eq: ["$$party.roles", ["supplier"]],
                      },
                    ],
                  },
                },
              },
              as: "filteredParty",
              in: {
                name: {
                  $ifNull: ["$$filteredParty.name", "$$REMOVE"],
                },
                address: {
                  $ifNull: [
                    {
                      $concat: [
                        "$$filteredParty.address.streetAddress",
                        "\n",
                        "$$filteredParty.address.locality",
                        " ",
                        "$$filteredParty.address.postalCode",
                        "\n",
                        "$$filteredParty.address.countryName",
                      ],
                    },
                    "$$REMOVE",
                  ],
                },
                country: {
                  $ifNull: ["$$filteredParty.address.countryName", "$$REMOVE"],
                },
                contact: {},
                url: {
                  $ifNull: [
                    {
                      $cond: [
                        {
                          $ne: ["$$filteredParty.contactPoint.url", null],
                        },
                        "$$filteredParty.contactPoint.url",
                        {
                          $cond: [
                            {
                              $regexMatch: {
                                input: "$$filteredParty.contactPoint.email",
                                regex: RegExp(
                                  '^(?:[a-zA-Z0-9])([-_0-9a-zA-Z]+(\\.[-_0-9a-zA-Z]+)*|^\\"([\\001-\\010\\013\\014\\016-\\037!#-\\[\\]-\\177]|\\\\[\\001-011\\013\\014\\016-\\177])*\\")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}\\.?$'
                                ),
                              },
                            },
                            {
                              $let: {
                                vars: {
                                  locality: {
                                    $split: [
                                      "$$filteredParty.contactPoint.email",
                                      "@",
                                    ],
                                  },
                                },
                                in: {
                                  $arrayElemAt: ["$$locality", -1],
                                },
                              },
                            },
                            null,
                          ],
                        },
                      ],
                    },
                    "$$REMOVE",
                  ],
                },
              },
            },
          },
        },
      },
      {
        $replaceWith: {
          $mergeObjects: [
            {
              $arrayToObject: {
                $filter: {
                  input: {
                    $objectToArray: "$$ROOT",
                  },
                  cond: {
                    $not: {
                      $in: ["$$this.v", [null, "", {}]],
                    },
                  },
                },
              },
            },
            {
              buyers: {
                $filter: {
                  input: {
                    $map: {
                      input: "$buyers",
                      as: "buyer",
                      in: {
                        $cond: {
                          if: {
                            $eq: [
                              {
                                $size: {
                                  $objectToArray: "$$buyer.contact",
                                },
                              },
                              0,
                            ],
                          },
                          then: {
                            $arrayToObject: {
                              $filter: {
                                input: {
                                  $objectToArray: "$$buyer",
                                },
                                cond: {
                                  $ne: ["$$this.k", "contact"],
                                },
                              },
                            },
                          },
                          else: {
                            $arrayToObject: {
                              $filter: {
                                input: {
                                  $objectToArray: "$$buyer",
                                },
                                cond: {
                                  $ne: ["$$this.v", ""],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  as: "item",
                  cond: {
                    $ne: ["$$item", {}],
                  },
                },
              },
            },
            {
              sellers: {
                $filter: {
                  input: {
                    $map: {
                      input: "$sellers",
                      as: "seller",
                      in: {
                        $cond: {
                          if: {
                            $eq: [
                              {
                                $size: {
                                  $objectToArray: "$$seller.contact",
                                },
                              },
                              0,
                            ],
                          },
                          then: {
                            $arrayToObject: {
                              $filter: {
                                input: {
                                  $objectToArray: "$$seller",
                                },
                                cond: {
                                  $ne: ["$$this.k", "contact"],
                                },
                              },
                            },
                          },
                          else: {
                            $arrayToObject: {
                              $filter: {
                                input: {
                                  $objectToArray: "$$seller",
                                },
                                cond: {
                                  $ne: ["$$this.v", ""],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  as: "item",
                  cond: {
                    $ne: ["$$item", {}],
                  },
                },
              },
            },
          ],
        },
      },
      {
        $replaceWith: {
          $arrayToObject: {
            $filter: {
              input: {
                $objectToArray: "$$ROOT",
              },
              cond: {
                $not: {
                  $in: ["$$this.v", [null, "", []]],
                },
              },
            },
          },
        },
      },
    ],
  });
};
