export const sideBarLinks = [
  {
    imgUrl: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgUrl: "/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgUrl: "/icons/star.svg",
    route: "/collections",
    label: "Collections",
  },
  {
    imgUrl: "/icons/suitcase.svg",
    route: "/find-jobs",
    label: "Find Jobs",
  },
  {
    imgUrl: "/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgUrl: "/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgUrl: "/icons/question.svg",
    route: "/ask-question",
    label: "Ask question",
  },
]

export const defaultPageSize = 10

export const maxRequestTimeout = 100000

// export const BADGE_CRITERIA = {
//   QUESTION_COUNT: {
//     BRONZE: 10,
//     SILVER: 50,
//     GOLD: 100,
//   },
//   ANSWER_COUNT: {
//     BRONZE: 10,
//     SILVER: 50,
//     GOLD: 100,
//   },
//   QUESTION_UPVOTES: {
//     BRONZE: 10,
//     SILVER: 50,
//     GOLD: 100,
//   },
//   ANSWER_UPVOTES: {
//     BRONZE: 10,
//     SILVER: 50,
//     GOLD: 100,
//   },
//   TOTAL_VIEWS: {
//     BRONZE: 1000,
//     SILVER: 10000,
//     GOLD: 100000,
//   },
// }

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 1,
    SILVER: 5,
    GOLD: 10,
  },
  ANSWER_COUNT: {
    BRONZE: 1,
    SILVER: 5,
    GOLD: 10,
  },
  QUESTION_UPVOTES: {
    BRONZE: 1,
    SILVER: 5,
    GOLD: 10,
  },
  ANSWER_UPVOTES: {
    BRONZE: 1,
    SILVER: 5,
    GOLD: 10,
  },
  TOTAL_VIEWS: {
    BRONZE: 1,
    SILVER: 5,
    GOLD: 10,
  },
}
