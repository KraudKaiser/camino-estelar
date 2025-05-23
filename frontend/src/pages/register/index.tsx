import axios from "axios";
import { FormEventHandler } from "react";
import { ReactFormState } from "react-dom/client";

export const RegisterPage = () => {

    const submitForm  = (e:React.ChangeEvent<HTMLFormElement>)  =>{
        e.preventDefault()

        if(e.target.password.value != e.target.repassword.value){
            alert("¡Las contraseñas no coinciden!")
            return
        }
        
        const user = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
            
        }

        axios.post("http://localhost:3003/usuarios/crear", user)
        

    }

    return (
        <main className="min-h-screen bg-[#000020] flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold text-blancolindo mb-6">Registrate</h1>
            <form className="flex flex-col items-center gap-6 w-full max-w-xl">
                <div className="text-center">
                    <h2 className="text-2xl text-blancolindo font-medium mb-2">
                        ¿Aún no te has registrado?
                    </h2>
                    <p className="text-lg text-blancolindo">
                        Creá tu cuenta en <strong className="text-turquesa font-semibold">Camino Estelar</strong>
                    </p>
                </div>

                {/* Nombre y Apellido */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col w-1/2">
                        <label className="text-sm text-turquesa mb-1">Nombre</label>
                        <input
                            className="bg-blancolindo px-4 py-2 rounded-lg border border-turquesa text-gray-800"
                            type="text"
                            name="name"
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="text-sm text-turquesa mb-1">Apellido</label>
                        <input
                            className="bg-blancolindo px-4 py-2 rounded-lg border border-turquesa text-gray-800"
                            type="text"
                            name="surname"
                        />
                    </div>
                </div>

                {/* Contraseña y Confirmar */}
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col w-1/2">
                        <label className="text-sm text-turquesa mb-1">Contraseña *</label>
                        <input
                            className="bg-blancolindo px-4 py-2 rounded-lg border border-turquesa text-gray-800"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="text-sm text-turquesa mb-1">Confirmá tu Contraseña *</label>
                        <input
                            className="bg-blancolindo px-4 py-2 rounded-lg border border-turquesa text-gray-800"
                            type="password"
                            name="repassword"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col w-full">
                    <label className="text-sm text-turquesa mb-1">Tu Correo Electrónico *</label>
                    <input
                        className="bg-blancolindo px-4 py-2 rounded-lg border border-turquesa text-gray-800"
                        type="email"
                        name="email"
                    />
                </div>

                <button
                    className=" px-2 py-3 bg-turquesa text-white rounded-lg font-semibold hover:scale-105 cursor-pointer transition-transform duration-300"
                    type="submit"
                >
                    Crear Usuario
                </button>
            </form>
        </main>
    );
};
