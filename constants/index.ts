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

export const maxAiAnswerCount = 50 as const

export const REPUTATION_POINTS = {
  upvote: {
    question: {
      performer: 2,
      author: 10,
    },
    answer: {
      performer: 0,
      question_author: 2,
      answer_author: 5,
    },
  },
  downvote: {
    question: {
      performer: -1,
      author: -2,
    },
    answer: {
      performer: -1,
      question_author: 0,
      answer_author: -5,
    },
  },
  post: {
    // author only
    question: 5,
    answer: 10,
  },
  delete: {
    // author only
    question: -5,
    answer: -10,
  },
} as const

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
// } as const

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
} as const
