import React, {useEffect, useState} from 'react';
import axios from "axios";

export default function PopupMenu({userDescription}) {
    const [isOpen, setIsOpen] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState(userDescription || '');
    const user = JSON.parse(localStorage.getItem('user'));
    const handleChange = (e) => {
        setTextAreaValue(e.target.value);
    };
    const [file, setFile] = useState(null);

    const handleSubmit = () => {
        console.log("submit")
        const url = 'http://localhost:8080/api/users/description/' + user.id
        const requestOptions = {
            method: 'PATCH',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({  'description': textAreaValue })
        };
        const formData = new FormData();
        formData.append('file', file);


        axios.post(`http://localhost:8080/api/user/${user.id}/avatar`, formData,{headers:{'Authorization':'Bearer ' + user.accessToken}})
            .then((response) => {

            });
        setIsOpen(false);
        fetch(url, requestOptions)
        window.location.reload(false);
    };
    useEffect(()=>{
        setTextAreaValue(userDescription || '')
    },[userDescription]);
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }
    console.log("123")
    console.log(userDescription)
    console.log(textAreaValue)

    return (
<div>
    <button id="popupButton" onClick={() => setIsOpen(true)}>Update description</button>
    {isOpen && (
        <div className="popup-menu">

            <div className="glass-effect"></div>
            <div className="content">
                <h3>Zmień swoje dane</h3>
                <div><label>
                    <span>Avatar:</span>

                        <input type="file" onChange={handleFileChange} />
                        {/*<button type="submit">Upload</button>*/}

                </label></div>
                <div><label>
                    <span>Dane:</span>
                    <textarea name="data" value={textAreaValue} onChange={handleChange} rows="4" cols="50"></textarea>
                </label></div>


            </div>
            <div className="buttons"> {/* Dodaj tę linię */}
                <button onClick={handleSubmit}>Zapisz</button>
                <button onClick={() => setIsOpen(false)}>Anuluj</button>
            </div> {/* Dodaj tę linię */}
        </div>)}
</div>
    );
}

