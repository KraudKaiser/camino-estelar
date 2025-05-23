import { Link } from "react-router-dom"
import { SearchBar } from "./Search"
import CaminoEstelar from "@/assets/images/caminoEstelar.jpeg"
export const Header = () =>{
    return(
        <header className="min-h-30 flex flex-col bg-[#00020f] text-amber-100">
            <div className="flex flex-row-reverse  px-4 py-2 text-sm bg-[#216eaf]" role="email-banner">@ emaildemicky@caminolunar.com</div>
            <div className="flex  items-center justify-evenly p-2"  role="banner">
                <SearchBar />
                <Link to="/" className="flex flex-col items-center hover:cursor-pointer">
                    <img className="aspect-square w-32 h-auto object-contain overflow-hidden" src={CaminoEstelar} alt="" />
                    <h1 className="text-3xl font-[500]">CAMINO ESTELAR</h1>     
                </Link>
                <span className="flex gap-4 items-center">
                    <Link to="/registrarse">CREAR CUENTA</Link>
                    <h2>|</h2>
                    <h2>INICIAR SESION</h2>
                </span>
            </div>
                <ul className="flex items-center justify-center gap-6 text-xl py-4 bg-[#216eaf]">
                    <Link to="/" className="hover:cursor-pointer" >INICIO</Link>
                    <li>PRODUCTOS</li>
                    <li>PREGUNTAS FRECUENTES</li>
                    <li>CONTACTO</li>
                </ul>
        </header>
    )
}