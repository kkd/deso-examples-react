
import { identity, getPostsStateless, getPostsForUser } from "deso-protocol";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../contexts";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const timestampToTime = (timestamp) => {
  const date = new Date(timestamp / 1000000);
  const yyyy = `${date.getFullYear()}`;
  // .slice(-2)で文字列中の末尾の2文字を取得する
  // `0${date.getHoge()}`.slice(-2) と書くことで０埋めをする
  const MM = `0${date.getMonth() + 1}`.slice(-2); // getMonth()の返り値は0が基点
  const dd = `0${date.getDate()}`.slice(-2);
  const HH = `0${date.getHours()}`.slice(-2);
  const mm = `0${date.getMinutes()}`.slice(-2);
  const ss = `0${date.getSeconds()}`.slice(-2);

  return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
}
const PostCard = (post) => {
  return (
    <Card variant="outlined" sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 10}}>
          {timestampToTime(post.TimestampNanos)}
        </Typography>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          {post.Body}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const GetPosts = () => {
  const { currentUser: user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const username =
    user?.ProfileEntryResponse?.Username ?? user?.PublicKeyBase58Check;

  if (!username) {
    return (
      <Button onClick={() => identity.login()}>Login to create a post</Button>
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
        PostCard(post)));
        // <div>
        //   {post.Body} 
        //   <div>
        //     ❤️{post.LikeCount} 💎{post.DiamondCount} 🔁{post.RepostCount} “”{post.QuoteRepostCount}
        //   </div>
        //   <div>
        //     {
        //       post.ImageURLs ? (
        //         post.ImageURLs.map((url) => 
        //           <div>
        //             <img src={url} alt={url}/><br />
        //           </div>
        //         )) : (
        //           undefined
        //         )
        //     }
        //   </div>
        // </div>));
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