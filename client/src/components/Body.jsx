import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Body = () => {
    const [form, setform] = useState({ website: "", username: "", password: "" });
    const [passwords, setpasswords] = useState([]);

    const getPasswords= async ()=>{
        try {
        let req = await fetch("https://password-manager-app-server.vercel.app", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Optional: You can include credentials if needed
            // credentials: 'include',
        });
        if (!req.ok) {
            throw new Error(`Error: ${req.status}`);
        }
        let passwords = await req.json();
        console.log(passwords);
        setpasswords(passwords);
    } catch (error) {
        console.error('Failed to fetch passwords:', error);
        // Optionally handle the error (e.g., display an error message)
    }
    }

    useEffect(() => {
        getPasswords()
    }, [])


    const ref = useRef();
    const ShowPass = (e) => {
        const ele = document.getElementById('password');

        if (ele.type === 'password') {
            ele.type = 'text';
            ref.current.src = "icons/Hide.svg";
        }
        else {
            ele.type = 'password';
            ref.current.src = "icons/Show.svg";
        }
    }

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const savepassword = async () => {
        if (form.website === "" || form.username === "" || form.password === "") {
            toast.error("Please fill all the fields");
        }
        else {
            setpasswords([...passwords, {...form, id : uuidv4()}]);
            let res = await fetch("https://password-manager-app-server.vercel.app",{method:"POST",headers:{"Content-Type":"application/json"}, body: JSON.stringify({...form, id : uuidv4()})});

            console.log([...passwords, form]);
            setform({ website: "", username: "", password: "" });
            toast("🦄 Password Saved!!");
        }
    }
    const handlecopy = (text) => {
        toast('🦄 Copied To Clipboard!!', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        navigator.clipboard.writeText(text);
    }
    const handledelete = async (id)=>{
        const newpasswords = passwords.filter((password)=>password.id !== id);
        setpasswords(newpasswords);
        // localStorage.setItem("passwords", JSON.stringify(newpasswords));
        let res = await fetch("https://password-manager-app-server.vercel.app",{method:"DELETE",headers:{"Content-Type":"application/json"}, body: JSON.stringify({id})});
        toast("🦄 Deleted Successfully!!");
    }
    const handleEdit = async (id)=>{
        const editpassword = passwords.filter((password)=>password.id === id);
        const newpasswords = passwords.filter((password)=>password.id !== id);
        await fetch("https://password-manager-app-server.vercel.app",{method:"DELETE",headers:{"Content-Type":"application/json"}, body: JSON.stringify({id: form.id})});
        setpasswords(newpasswords);
        // localStorage.setItem("passwords", JSON.stringify(newpasswords));
        setform({...editpassword[0],id:id});
    }
    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce} />
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] text-white">
                <div className="Container 2xl:w-[55vw] lg:w-[77vw] rounded-2xl">
                    <input value={form.website} onChange={handlechange} name='website' className='h-12 p-2 w-full text-black rounded-lg' type="text" placeholder='Enter the Website URL' />
                    <input value={form.username} onChange={handlechange} name='username' className='h-12 mt-2 p-2 w-full text-black rounded-lg' type="text" placeholder='Enter the Username' />
                    <div className=' w-full mt-2 flex justify-between gap-2'>
                        <div className="pass w-3/4 flex items-center relative">
                            <input value={form.password} onChange={handlechange} name='password' className='h-12 p-2 w-full text-black rounded-lg' type="password" id='password' placeholder='Enter the Password' />
                            <span className=' absolute right-2 cursor-pointer' onClick={(e) => ShowPass(e)}>
                                <img ref={ref} src="icons/Show.svg" alt="" />
                            </span>
                        </div>
                        <button onClick={savepassword} className='w-1/4 rounded-xl flex justify-center items-center gap-2 text-base sm:text-lg'>
                            <lord-icon
                                src="https://cdn.lordicon.com/jgnvfzqg.json"
                                trigger="loop"
                                delay="1000"
                                colors="primary:#ffffff"
                                style={{width:"26px",height:"26px"}}>
                            </lord-icon>
                            Save</button>
                    </div>

                    <div className="relative shadow-md sm:rounded-lg mt-2 overflow-y-auto h-[53vh]">
                        <table className=" w-full text-sm text-left rtl:text-right text-white table-fixed">
                            <thead className="sm:text-base text-xs text-white uppercase table_head h-14">
                                <tr>
                                    <th scope="col" className="px-6 py-3 w-1/3">
                                        Website URL
                                    </th>
                                    <th scope="col" className="px-6 py-3 w-1/4 ">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 w-1/4">
                                        Password
                                    </th>
                                    <th scope="col" className="px-6 py-3 w-1/6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            {passwords.length === 0 && <div className='text-lg'> No Passwords to show</div>}
                            {passwords.length != 0 && <tbody>
                                {passwords.map((item, index) => {
                                    return <tr key={index}>
                                        <td className="px-6 py-4 font-medium break-words">
                                            <a href={item.website} target="_blank">{item.website}</a>
                                        </td>
                                        <td className="px-6 py-4 font-medium break-words">
                                            {item.username}
                                        </td>
                                        <td className="px-6 py-4 font-medium break-words">
                                            {item.password}
                                        </td>
                                        <td className="px-6 py-4 text-right flex flex-wrap sm:flex-nowrap justify-center items-center gap-2">
                                            <div className='flex items-center justify-center cursor-pointer min-w-6 min-h-6'><img onClick={() => { handlecopy(item.password) }} src="icons/Copy.svg" alt="" /></div>
                                            <div className='flex items-center justify-center cursor-pointer min-w-6 min-h-6'><img onClick={()=>{{handleEdit(item.id)}}} src="icons/Edit.svg" alt="" /></div>
                                            <div onClick={()=>{{handledelete(item.id)}}} className='flex items-center justify-center cursor-pointer'>
                                                <lord-icon
                                                src="https://cdn.lordicon.com/wpyrrmcq.json"
                                                trigger="loop-on-hover"
                                                colors="primary:#ffffff"
                                                delay="500"
                                                style={{width:"24px",height:"24px"}}>
                                                </lord-icon>
                                            </div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                            }
                        </table>
                    </div>

                </div>

            </div>


        </div>
    )
}

export default Body
