import PocketBase from 'pocketbase';
const pb = new PocketBase("http://127.0.0.1:8090/_/");


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

export async function getPosts(){
    try {
        let data = await pb.collection('post').getFullList({
            sort: '+Nb_Fav',
    });
    } catch(error){
        console.log("Une erreur est survenue en lisant la liste des posts", error);
    }
}

