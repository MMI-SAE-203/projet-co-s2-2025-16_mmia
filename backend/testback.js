import {getUserbyPost, getPost, getUser, getUsers} from './backend.mjs';
import { addUSer } from '../script/login.js';

// try {const records = await getUserbyPost ('w83ir4g9w87ifl6') ;
//     console.log(JSON.stringify(records, null, 2)) ;
//     } catch (e) {
//         console.error(e);
//     };

// try {const records = await getPost ('w83ir4g9w87ifl6') ;
//     console.log(JSON.stringify(records, null, 2)) ;
//     } catch (e) {
//         console.error(e);
//     };

try {const records = await getUser ('48x72a2dy8hcp35') ;
    console.log(JSON.stringify(records, null, 2)) ;
    } catch (e) {
        console.error(e);
    };

// try {const records = await getUsers () ;
//     console.log(JSON.stringify(records, null, 2)) ;
//     } catch (e) {
//         console.error(e);
//     };

//try{ const records = await addUSer ({
//    "email": "pol@gmail.com",
//    "password": "pol12345",
//    "passwordConfirm": "pol12345",
//  "username": "pol",
//    "prenom": "pol",
//    "nom": "pol",
//    "specialite": "Design",
//    "Pseudo": "pol",
//    "age": 25,
//})} catch (e) {
//    console.error(e);
//} 

// try {const records =await marche("pol@gmail.com", "pol12345") ;
//     console.log(JSON.stringify(records, null, 2)) ;
//     console.log("Connexion réussie") ;
// }
// catch (e) {
//     console.error(e);
//     console.log("Connexion échouée") ;
// }