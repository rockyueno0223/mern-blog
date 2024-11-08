import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { Button, TextInput } from "flowbite-react";
import { ChangeEvent, useRef, useState } from "react";

function DashProfile() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const filePickerRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className="w-32 h-32 self-center shadow-md cursor-pointer overflow-hidden rounded-full" onClick={() => filePickerRef.current?.click()}>
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id='username'
          placeholder="username"
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="email"
          id='email'
          placeholder="email"
          defaultValue={currentUser?.email}
        />
        <TextInput
          type="password"
          id='password'
          placeholder="password"
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile
