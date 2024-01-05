const nbaData = [
  {
    id: "1",
    name: "NBA",
    children: [
      {
        id: "2",
        name: "Teams",
        children: [
          {
            id: "3",
            name: "Eastern Conference",
            children: [
              {
                id: "4",
                name: "Atlantic Division",
                children: [
                  {
                    id: "5",
                    name: "Boston Celtics",
                    children: [
                      {
                        id: "6",
                        name: "Players",
                        children: [
                          {
                            id: "7",
                            name: "Jayson Tatum"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "8",
        name: "Top Players",
        children: [
          {
            id: "9",
            name: "LeBron James",
            children: [
              {
                id: "10",
                name: "Statistics",
                children: [
                  {
                    id: "11",
                    name: "2020-2021",
                    children: [
                      {
                        id: "12",
                        name: "Points",
                        children: [
                          {
                            id: "13",
                            name: "25.8 PPG"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "14",
        name: "Awards",
        children: [
          {
            id: "15",
            name: "Most Valuable Player",
            children: [
              {
                id: "16",
                name: "2020",
                children: [
                  {
                    id: "17",
                    name: "Giannis Antetokounmpo",
                    children: [
                      {
                        id: "18",
                        name: "Team",
                        children: [
                          {
                            id: "19",
                            name: "Milwaukee Buks"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export function fetchData() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100, nbaData);
  });
}
