import PocketBase from 'pocketbase'
const pb = new PocketBase('https://mmia.pauldarlef.fr:443') ;
//https://mmia.pauldarlef.fr:443
//http://127.0.0.1:8090


//ajout / suppression / mise à jour d'un post
export async function addNewPost(Post){
    await pb.collection('post').create(Post);
}

export async function DeletePostById(id){
    await pb.collection('post').delete(id);
}

export async function updatePostById(id, Post){
    await pb.collection('post').update(id, Post);
}

//section Vue
export async function getPosts(){
    try {
        let data = await pb.collection('post').getFullList({
            sort: '+Nb_Fav',
    });
    data = data.map((item) => {
        return item;
     });
    return data;
    } catch(error){
        console.log("Une erreur est survenue en lisant la liste des posts", error);
    }
}

export async function getPost(id){
    try {
        let data = await pb.collection('post').getOne(id);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant le post', error);
        return null;
    }
}


export async function getUser(id) {
    try {
        let data = await pb.collection('users').getOne(id);
        if (data.avatar) {
            data.img = pb.files.getURL(data, data.avatar);
        } else {
            data.img = null;
        }
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant l\'utilisateur', error);
        return null;
    }
}

export async function getUsers() {
    try {
        const userrecords = await pb.collection('users').getFullList();
        return userrecords;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des utilisateurs', error);
        return (e);
    }
}


export async function getUserbyPost(id){
    try {
        let userpost = await pb.collection('post').getOne(id, {expand: 'user'});
        if (userpost.expand && userpost.expand.user && userpost.expand.user.avatar) {
            userpost.img = pb.files.getURL(userpost.expand.user, userpost.expand.user.avatar);
        }
        return userpost;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur du post:', error);
        return null;
    }
}


export async function login(email, password) {
    try {
        // Attempt authentication with PocketBase
        const authData = await pb.collection('users').authWithPassword(email, password);
        
        // Return the auth data which contains user and token information
        return {
            success: true,
            user: authData.record,
            token: pb.authStore.token
        };
    } catch (error) {
        console.error('Login failed:', error.message);
        return {
            success: false,
            message: error.message || 'Authentication failed'
        };
    }
}

export async function  register() {
    await pb.collection('users').create({
        email: document.getElementById("login").value,
        password: document.getElementById("passwd").value,
        nom: document.getElementById("nom").value,
        passwordConfirm: document.getElementById("passwd").value,
    });
}