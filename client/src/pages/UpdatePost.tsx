import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormDataType } from "../types/types";
import { RootState } from "../redux/store";


function UpdatePost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<FormDataType>({});
  const [publishError, setPublishError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    }
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
      console.error(error);
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput typeof="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload image
          </Button>
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something"
          className="h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
        >
          Update post
        </Button>
        {publishError &&
          <Alert color="failure" className="my-5">
            {publishError}
          </Alert>
        }
      </form>
    </div>
  )
}

export default UpdatePost
