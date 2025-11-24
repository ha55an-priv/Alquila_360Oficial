"use client"

import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers } from "../services/user.services";
import styles from "./page.module.css";

export default function User() {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<Partial<User>>({
        name: "",
        lastName: "",
        email: "",
        password: ""
    });
    
    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await getUsers();
            setUsers(usersData);
        };

        fetchUsers();
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createUser(user);
        setUsers([...users, response]);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const deleteSelectedUser = async (id: number) => {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
    }

    return (
        <div className={styles.userContainer}>
            <form className={styles.userForm} onSubmit={onSubmit}>
                <input className={styles.userFormInput} type="text" name="name" placeholder="Nombre" value={user.name} onChange={handleChange}/>
                <input className={styles.userFormInput} type="text" name="lastName" placeholder="Apellido" value={user.lastName} onChange={handleChange}/>
                <input className={styles.userFormInput} type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange}/>
                <input className={styles.userFormInput} type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange}/>
                <button className={styles.userFormButton} type="submit">Crear Usuario</button>
            </form>
            <div className={styles.userCards}>
                {users.map((user: any) => (
                    <div className={styles.userCard}>
                        <h1>id: {user.id}</h1>
                        <p>nombre: {user.name}</p>
                        <p>apellido: {user.lastName}</p>
                        <p>mail: {user.email}</p>
                        <button onClick={() => deleteSelectedUser(user.id)} className={styles.userCardButton}>Eliminar</button>
                    </div>
                ))}
            </div> 
        </div>  
    );
}
