// export interface User {
//     _id: String;
//     username: String;
//     email: String;
//     password?:String;
//     profilePicture?:String;
//     bio?:String;
//     followers:string[];
//     following:string[];
//     posts:Post[];
//     savedPosts:string[] | Post[];
//     isVerfied:Boolean;
// }

// exports interface Comment {
//     _id: String;
//     text: String;
//     user: {
//         _id: String;
//         username: String;
//         profilePicture:String;
//     };
//     createdAt:String;
// }

// exports interface Post {
//     _id:String;
//     caption:String;
//     image?: {
//         url:String;
//         publicId:String;
//     };
//     user: User | undefined;
//     likeS:string[];
//     comments:Comment[];
//     createdAt:String;
// }