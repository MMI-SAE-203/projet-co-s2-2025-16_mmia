import PocketBase from 'pocketbase'
const pb = new PocketBase('https://mmia.pauldarlef.fr:443') ;
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

export async function getPost(id){
    try {
        let data = await pb.collection('post').getOne(id);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant le post', error);
        return null;
    }
}

export async function getUserbyPost(id){
    try {
        // Récupérer le post avec l'utilisateur qui l'a créé
        let post = await pb.collection('posts').getOne(id, {
            expand: 'user'
        });
        
        // Extraire l'utilisateur du post
        let user = post.expand.user;
        
        // Ajouter l'URL de l'avatar si il existe
        if (user && user.avatar) {
            user.img = pb.files.getURL(user, user.avatar);
        }
        
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur du post:', error);
        return null;
    }
}
