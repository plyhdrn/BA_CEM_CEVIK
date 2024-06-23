import mongoose from "mongoose";

export const createTedMeta = async (): Promise<void> => {
  await mongoose.connection.db.dropCollection("tedMeta");
  await mongoose.connection.db.createCollection("tedMeta", {
    viewOn: "teds",
    pipeline: [
      {
        $project: {
          entryId: "$publication-number",
          source: "ted",
          publishDate: "$publication-date",
          title: "$notice-title.deu",
          description: {
            $ifNull: [
              {
                $trim: {
                  input: {
                    $first: "$FT.deu",
                  },
                },
              },
              "$$REMOVE",
            ],
          },
          amount: {
            amount: {
              $ifNull: ["$total-value", "$$REMOVE"],
            },
            currency: {
              $cond: [
                {
                  $eq: [
                    {
                      $ifNull: ["$total-value", null],
                    },
                    null,
                  ],
                },
                "$$REMOVE",
                {
                  $first: "$total-value-cur",
                },
              ],
            },
          },
          buyers: {
            $map: {
              input: {
                $zip: {
                  inputs: [
                    {
                      $ifNull: ["$buyer-name.deu", [null]],
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$buyer-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$buyer-country", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$buyer-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$buyer-city.mul", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$buyer-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: {
                          $ifNull: ["$organisation-post-code-buyer", [null]],
                        },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$buyer-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$buyer-internet-address", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$buyer-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$buyer-email", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$buyer-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$organisation-tel-buyer", [null]] },
                      },
                    },
                  ],
                  useLongestLength: true,
                  defaults: [null, null, null, null, null, null, null],
                },
              },
              as: "buyer",
              in: {
                name: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $arrayElemAt: ["$$buyer", 0],
                        },
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                country: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $arrayElemAt: ["$$buyer", 1],
                        },
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                address: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $concat: [
                            {
                              $arrayElemAt: ["$$buyer", 2],
                            },
                            " ",
                            {
                              $arrayElemAt: ["$$buyer", 3],
                            },
                            "\n",
                            {
                              $arrayElemAt: ["$$buyer", 1],
                            },
                          ],
                        },
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                url: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $cond: [
                            {
                              $ne: [
                                {
                                  $arrayElemAt: ["$$buyer", 4],
                                },
                                null,
                              ],
                            },
                            {
                              $arrayElemAt: ["$$buyer", 4],
                            },
                            {
                              $cond: [
                                {
                                  $regexMatch: {
                                    input: {
                                      $arrayElemAt: ["$$buyer", 5],
                                    },
                                    regex: RegExp("^[^@]+@[^@]+.[^@]{2,4}$"),
                                  },
                                },
                                {
                                  $let: {
                                    vars: {
                                      locality: {
                                        $split: [
                                          {
                                            $arrayElemAt: ["$$buyer", 5],
                                          },
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
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                contact: {
                  email: {
                    $ifNull: [
                      {
                        $trim: {
                          input: {
                            $arrayElemAt: ["$$buyer", 5],
                          },
                        },
                      },
                      "$$REMOVE",
                    ],
                  },
                  phone: {
                    $ifNull: [
                      {
                        $trim: {
                          input: {
                            $arrayElemAt: ["$$buyer", 6],
                          },
                        },
                      },
                      "$$REMOVE",
                    ],
                  },
                },
              },
            },
          },
          sellers: {
            $map: {
              input: {
                $zip: {
                  inputs: [
                    {
                      $ifNull: ["$winner-name.deu", [null]],
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$winner-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$winner-country", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$winner-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$winner-city", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$winner-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$winner-post-code", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$winner-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$winner-internet-address", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$winner-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: { $ifNull: ["$winner-email", [null]] },
                      },
                    },
                    {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $ifNull: ["$winner-name.deu", [null, null]],
                              },
                            },
                            1,
                          ],
                        },
                        then: [null],
                        else: {
                          $ifNull: ["$organisation-tel-tenderer", [null]],
                        },
                      },
                    },
                  ],
                  useLongestLength: true,
                  defaults: [null, null, null, null, null, null, null],
                },
              },
              as: "seller",
              in: {
                name: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $arrayElemAt: ["$$seller", 0],
                        },
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                country: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $arrayElemAt: ["$$seller", 1],
                        },
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                address: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $concat: [
                            {
                              $arrayElemAt: ["$$seller", 2],
                            },
                            " ",
                            {
                              $arrayElemAt: ["$$seller", 3],
                            },
                            "\n",
                            {
                              $arrayElemAt: ["$$seller", 1],
                            },
                          ],
                        },
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                url: {
                  $ifNull: [
                    {
                      $trim: {
                        input: {
                          $cond: [
                            {
                              $ne: [
                                {
                                  $arrayElemAt: ["$$seller", 4],
                                },
                                null,
                              ],
                            },
                            {
                              $arrayElemAt: ["$$seller", 4],
                            },
                            {
                              $cond: [
                                {
                                  $regexMatch: {
                                    input: {
                                      $arrayElemAt: ["$$seller", 5],
                                    },
                                    regex: /^[^@]+@[^@]+.[^@]{2,4}$/,
                                  },
                                },
                                {
                                  $let: {
                                    vars: {
                                      locality: {
                                        $split: [
                                          {
                                            $arrayElemAt: ["$$seller", 5],
                                          },
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
                      },
                    },
                    "$$REMOVE",
                  ],
                },
                contact: {
                  email: {
                    $ifNull: [
                      {
                        $trim: {
                          input: {
                            $arrayElemAt: ["$$seller", 5],
                          },
                        },
                      },
                      "$$REMOVE",
                    ],
                  },
                  phone: {
                    $ifNull: [
                      {
                        $trim: {
                          input: {
                            $arrayElemAt: ["$$seller", 6],
                          },
                        },
                      },
                      "$$REMOVE",
                    ],
                  },
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
