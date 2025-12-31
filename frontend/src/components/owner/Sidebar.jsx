import React, { useState } from 'react';
import assets from '../../assets/assets';
import { ownerMenuLinks } from '../../assets/assets';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Sidebar = () => {
  const { user } = useAppContext(); // Real user from context
  const location = useLocation();
  const [image, setImage] = useState(null);

  const updateImage = async () => {
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post("/api/owner/update-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Profile image updated");
        setImage(null);
        // Optionally refetch user to update UI
      }
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-bordercolor text-sm'>
      <div className='group relative'>
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"}
            alt="Profile"
            className='h-9 md:h-23 w-9 md:w-25 rounded-full mx-auto'
          />
          <input
            type="file"
            id="image"
            accept='image/*'
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <img src={assets.edit_icon} alt="Edit" />
          </div>
        </label>
      </div>

      {image && (
        <button
          onClick={updateImage}
          className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer'
        >
          Save <img src={assets.check_icon} width={13} alt="Save" />
        </button>
      )}

      <p className='mt-2 text-base max-md:hidden'>{user?.name || "Owner"}</p>

      <div className='w-full'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'
            }`}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt="icon"
            />
            <span className='max-md:hidden'>{link.name}</span>
            <div
              className={`${
                link.path === location.pathname && 'bg-primary'
              } w-1.5 h-8 rounded-1 right-0 absolute`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;