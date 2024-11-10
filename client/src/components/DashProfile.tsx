import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signoutSuccess
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state: RootState) => state.user);

  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(null);
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return
    }
    try {
      dispatch((updateStart()));
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure((error as Error).message));
      setUpdateUserError((error as Error).message);
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailure((error as Error).message));
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id='email'
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id='password'
          placeholder="password"
          onChange={handleChange}
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
        <span
          className="cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
        <span
          className="cursor-pointer"
          onClick={handleSignout}
        >
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteUser}
              >
                Yes
              </Button>
              <Button
                color="gray"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile
