import React ,{useState} from 'react'
import useCustomToast from './useCustomTost';

function usePreviewImg() {
    const [imgUrl, setImgUrl] = useState(null);
    const {showErrorToast} = useCustomToast();

    const handleImageChange = (e) =>{
        const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file);
        }else{
           showErrorToast("Please select an image file");
           setImgUrl(null);
        }
    }
  return{handleImageChange, imgUrl, setImgUrl}
}

export default usePreviewImg