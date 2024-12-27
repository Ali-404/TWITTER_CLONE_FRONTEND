import { useEffect, useRef, useState } from 'react';
import Textarea from 'react-expanding-textarea';
import { Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import axiosClient from '../axios';
import UserProfileImg from './UserProfileImg';
import Post from './Post';
import { buttonClass } from '../data/classes';

// UserWrite Component
const UserWrite = ({ setPosts }) => {
  const { user } = useSelector((state) => state.auth);
  const [postText, setPostText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const filesInput = useRef(null);

  const uploadFiles = async (postId) => {
    try {
      if (selectedFiles.length === 0) {
        console.log('No files uploaded with post.');
        return;
      }

      await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');
          formData.append('postId', postId);

          const response = await axiosClient.post('files/add', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log(response.data.message);
        })
      );
    } catch (e) {
      console.warn('File upload error:', e);
    } finally {
      setSelectedFiles([]);
    }
  };

  const addPost = async () => {
    try {
      setIsSending(true);
      const result = await axiosClient.post(
        '/posts/create',
        { content: postText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (result.data) {
        setPosts((prev) => [...prev, result.data.post]);
        await uploadFiles(result.data.post.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostText('');
      setIsSending(false);
    }
  };

  const selectFiles = (e) => {
    setSelectedFiles((prev) => [...prev, ...e.currentTarget.files]);
  };

  const removeFileFromSelected = (file) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file));
  };

  return (
    <div className="p-4 rounded-md shadow-md bg-slate-50 flex flex-col w-[95%] md:w-[60%]">
      <div className="flex justify-between gap-2">
        <UserProfileImg url={user.profile_img} letter={user.username[0]} />
        <Textarea
          value={postText}
          onChange={(e) => setPostText(e.currentTarget.value)}
          placeholder="What is happening?"
          className="resize-none outline-none flex-1 bg-transparent"
        />
      </div>
      <div className="flex items-center gap-3 py-2 justify-between">
        <div className="flex gap-4">
          <Button
            variant="contained"
            onClick={() => filesInput.current.click()}
            color="primary"
            size="small"
          >
            <div className="flex items-center justify-between gap-1 text-[12px]">
              <i className="material-icons text-sm">image movie</i> Add pictures/videos
            </div>
          </Button>
          <input
            onChange={selectFiles}
            ref={filesInput}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
          />
        </div>
        <button
          disabled={postText.trim().length === 0 || isSending}
          className={`${buttonClass} text-sm bg-orange-200 hover:bg-orange-400`}
          onClick={addPost}
        >
          {isSending ? <CircularProgress /> : 'POST'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 w-full">
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className="relative w-12 h-12 shadow rounded-md bg-orange-200 overflow-hidden cursor-pointer"
            onClick={() => removeFileFromSelected(file)}
          >
            <div className="z-50 material-icons absolute top-0 start-0 w-full h-full text-red-600 items-center justify-center flex opacity-0 hover:opacity-100">
              delete
            </div>
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full" />
            ) : (
              <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" autoPlay loop />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// PostsView Component
export default function PostsView() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextDataExists, setNextDataExists] = useState(true);

  const loadPosts = async (firstTime = false) => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/posts', {
        params: { page: firstTime ? 1 : currentPage },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (res.data.posts) {
        setPosts((prevPosts) => {
          const _prevPosts = firstTime ? [] : prevPosts;
          return [..._prevPosts, ...res.data.posts];
        });
        setNextDataExists(res.data.nextDataExists);

        if (res.data.nextDataExists) {
          setCurrentPage((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (posts.length === 0) {
      loadPosts(true);
    }
  }, []);

  return (
    <div className="flex-1 flex items-center flex-col md:p-6 gap-4 overflow-auto">
      <UserWrite setPosts={setPosts} />
      {loading && <CircularProgress />}
      {posts
        .sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt))
        .map((post, key) => (
          <Post setPosts={setPosts} postData={post} key={key} />
        ))}
      {nextDataExists && !loading && (
        <button
          className={`${buttonClass} border bg-transparent p-0`}
          onClick={() => loadPosts(false)}
          disabled={loading}
        >
          Load More
        </button>
      )}
    </div>
  );
}
