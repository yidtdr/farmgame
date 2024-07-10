let mapData = {
    dataType: "game-session",
    player: 
    {
     ItemInventory:
     {
      map:
      {
       bread: 3
      }
     },
     SeedsInventory:
     {
      map:
      {
       pizdec: 2,
       wheat: 1,
      }
     },
     money: 10,
     spin:
     {
      activated: true,
      drop:
      {
       amount: 9,
       item: "wheat",
      },
      generateTimeStamp: "2024-06-21T15:38:00.467225400Z",  // время будет координироваться с серверным. Это время когда был сгенерирован спин, нужно отловить когда он просрочится и отправить пакет "regenerate/"
      items: 
      [
       {item: 'wheat', amount: 10},
       {item: 'pizdec', amount: 2},
       {item: 'wheat', amount: 9},
       {item: 'wheat', amount: 5},
       {item: 'pizdec', amount: 1},
       {item: 'bread', amount: 39},//мани
      ]
     }
    },
    world:
    {
     "tileArray": [
    [
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": true,
        "place": {
          "name": "bakery",
          "workSlots": {
            "0": {
              "name": "bread",
              "startTimeStamp": 1712809814
            }
          }
        }
      },
      {
        "occupied": true,
        "place": {
            "name": "none"
          }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      }],
      [
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": true,
        "place": {
            "name": "none"
          }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      }],
      [
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": true,
        "place": {
            "name": "none"
          }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      },
      {
        "occupied": false,
        "place": {
          "name": "none"
        }
      }],
      [
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        }
      ],
      [
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        },
        {
        "occupied": false,
        "place": {
          "name": "none"
        }
        }
      ]
    ]
    }
   }

export default mapData;