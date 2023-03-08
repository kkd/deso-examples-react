
import { identity, getPostsStateless, getPostsForUser } from "deso-protocol";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../contexts";

export const GetPosts = () => {
  const { currentUser: user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const username =
    user?.ProfileEntryResponse?.Username ?? user?.PublicKeyBase58Check;

  if (!username) {
    return (
      <button onClick={() => identity.login()}>Login to create a post</button>
    );
  }

  console.log(user.PublicKeyBase58Check);

  const createFetch = () => {
    getPostsForUser({
      PublicKeyBase58Check: user.PublicKeyBase58Check,
      NumToFetch: 10,
    }).then((res) => {
      console.log(res);
      setPosts(res.Posts.map((post) => 
        <div>
          {post.Body} 
          <div>
            ❤️{post.LikeCount} 💎{post.DiamondCount} 🔁{post.RepostCount} “”{post.QuoteRepostCount}
          </div>
          <div>
            {
              post.ImageURLs ? (
                post.ImageURLs.map((url) => 
                  <div>
                    <img src={url} alt={url}/><br />
                  </div>
                )) : (
                  undefined
                )
            }
          </div>
        </div>));
      });
  }

  return (
    <>
      <h1>Get Posts</h1>
      <button onClick={() => {
        createFetch();
      }}>Get Posts</button>

      <div>
        {posts}
      </div>

    </>
  );
}