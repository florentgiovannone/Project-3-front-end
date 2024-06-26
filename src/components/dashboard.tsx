import { IUser } from "../interfaces/user"
import { IWines } from "../interfaces/wine";
import Footer from "./footer"
import React, { SyntheticEvent, useEffect, useState } from "react"
import axios from "axios";
import WineCardDashboard from "./WinecardDashboard";
import { useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../config";

type Wines = null | Array<IWines>

export default function Dashboard({ user }: { user: null | IUser }) {
    const [currentUser, updateCurrentUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [lastPasswordChange, setLastPasswordChange] = useState<Date | null>(null);
    const [errorMessage, setErrorMessage] = useState("")

    async function fetchUser() {
        const token = localStorage.getItem('token')
        const resp = await axios.get(`${baseUrl}/rouge/user`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        updateCurrentUser(resp.data._id)
        setLastPasswordChange(new Date(resp.data.lastPasswordChange))
    }

    function handleOpenModal() {
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    async function handleChangePassword() {
        try {
            if (newPassword !== confirmPassword) {
                setErrorMessage('New password and confirmed password do not match');
                return;
            }
            const token = localStorage.getItem('token')
            const resp = await axios.post(`${baseUrl}/rouge/user/verify-password`, { password: oldPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (resp.data.isPasswordCorrect) {
                const userId = user ? user._id : null;
                if (userId) {
                    const response = await axios.put(`${baseUrl}/rouge/user/${userId}`, { password: newPassword }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setLastPasswordChange(new Date(response.data.lastPasswordChange));
                    fetchUser()
                    setErrorMessage('Password has been changed');
                    setIsModalOpen(false);
                    window.location.reload();
                } else {
                    setErrorMessage("User ID is null");
                }
            } else {
                setErrorMessage('Old password is incorrect');
            }
        } catch (error) {
            setErrorMessage("Error updating password: ");
        }
    }


    console.log(currentUser);
    React.useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) fetchUser()
    }, [])

    const [wines, setWines] = React.useState<Wines>(null)

    React.useEffect(() => {
        async function fetchWines() {
            const token = localStorage.getItem('token')
            const resp = await fetch(`${baseUrl}/rouge/user/cave/${currentUser}`,
                { headers: { Authorization: `Bearer ${token}` } })
            const data = await resp.json()
            setWines(data.myCave)
        }
        fetchWines()
    }, [currentUser])
    console.log("wines", wines);
    return (
        <>
            <h1 className="title has-text-centered is-rouge mt-6">My Dashboard</h1>
            <section className="section">
                <div className=" container has-text-centered is-widescreen">
                    <div className="account column is-rounded background-is-grey is-centered m-6">
                        <h5 className="title has-text-black has-text-centered mb-6">My Account</h5>
                        <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Firstname:`}</span> {user?.firstName}</p>
                        <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Lastname:`}</span> {user?.lastName}</p>
                        <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Username:`}</span> {user?.userName}</p>
                        <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Email:`}</span> {user?.email}</p>
                        <p className="is-rouge has-text-weight-semibold has-text-centered mb-3"><span className="title has-text-black is-rouge is-4">{`Last password changed: `}</span> {lastPasswordChange ? lastPasswordChange.toLocaleDateString() : 'Not available'}</p>
                        <a href={`/updateaccount/${currentUser}`}><button className="button is-outlined background-is-rouge m-4 is-primary mt-4">Update account</button></a>
                        <button className="button is-outlined background-is-rouge m-4 is-primary mt-4" onClick={handleOpenModal}>
                            Change Password
                        </button>

                        {isModalOpen && (
                            <div className="modal is-active">
                                <div className="modal-background" onClick={handleCloseModal}></div>
                                <div className="modal-card">
                                    <header className="modal-card-head background-is-rouge">
                                        <p className="modal-card-title has-text-white">Update Password</p>
                                        <button className="delete" aria-label="close" onClick={handleCloseModal}></button>
                                    </header>
                                    <section className="modal-card-body">
                                        <input className="input" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Old Password" />
                                        <input className="input mt-4" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" />
                                        <input className="input mt-4" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" />
                                        {errorMessage && <small className="has-text-danger">{errorMessage}</small>}
                                    </section>
                                    <footer className="modal-card-foot">
                                        <button className="button is-success background-is-rouge m-4" onClick={handleChangePassword}>Update Password</button>
                                    </footer>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="account column is-rounded background-is-grey  m-6">
                        <h5 className="title has-text-black has-text-centered mb-6">My Cave</h5>
                        <div className="columns has-text-centered is-centered is-centered m-6">
                            <div className="columns has-text-centered is-centered is-multiline">
                                {wines?.map((wine) => {
                                    return <WineCardDashboard
                                        key={wine._id}
                                        {...wine}
                                    />
                                })}
                            </div>
                        </div>

                    </div>
                    <div className="columns has-text-centered is-centered is-multiline">
                        <a href="/user"><button className="button  border-is-rouge">Search users</button></a>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}