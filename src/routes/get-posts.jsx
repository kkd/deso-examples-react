import { identity } from "@deso-core/identity";
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

  const createFetch = () => {
    fetch("https://node.deso.org/api/v0/get-posts-for-public-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        PublicKeyBase58Check: user.PublicKeyBase58Check,
        ReaderPublicKeyBase58Check: user.PublicKeyBase58Check,
        NumToFetch: 10,
      }),
    }).then((res) => res.json()
    ).then((data) => {
      console.log(data);
      setPosts(data.Posts.map((post) => 
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
      </div>))
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