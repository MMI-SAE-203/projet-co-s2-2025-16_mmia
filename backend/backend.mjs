import PocketBase from 'pocketBase' ;
const pb = new PocketBase('https://mmia.pauldarlef.fr:443/_/') ;
//https://mmia.pauldarlef.fr:443

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

