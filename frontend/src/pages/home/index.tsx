import CaminoEstelar from "@/assets/images/caminoEstelar.jpeg"
import { Link } from "react-router-dom"

const productos = [
    {
        name:"SUPER PRODUCTO 1",
        price:null,
        placementPays:12,
        
    },
    {
        name:"SUPER PRODUCTO 2",
        price:14999.99,
        placementPays:12
    },
    {
        name:"SUPER PRODUCTO 3",
        price:23999.99,
        placementPays:12
    },
    {
        name:"SUPER PRODUCTO 4",
        price:null,
        placementPays:6
    },
    {
        name:"SUPER PRODUCTO 5",
        price:12999.99,
        placementPays:6
    },
]

export const Home = () =>{
    return(
        <main className="flex flex-col min-h-dvh bg-[#00020f]">
            <section className="grid grid-cols-3 gap-4 p-4">
                {
                    productos.map((producto) =>(
                        <Link to={`/${producto.name}`} className="flex flex-col items-center justify-center rounded-lg text-center text-amber-100 hover:bg-gray-800 cursor-pointer">
                            <img className="aspect-square object-contain w-64 h-auto" src={CaminoEstelar} alt="" />
                            <h3 className="">{producto.name}</h3>
                            {producto.price && (
                                <h4>{`ARS$${producto.price}`}</h4>
                            )}
                            <h4>HASTA EN {producto.placementPays} CUOTAS</h4>

                        </Link>
                    ))
                }
            </section>
        </main>
    )
}