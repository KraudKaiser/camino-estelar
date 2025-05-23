export const SearchBar = () =>{
    return(
        <span className="flex w-64 rounded-lg overflow-hidden     ">
            <input className=" w-2/3 bg-[#daf8f7] text-[#216eaf] px-2  py-4 outline-none" type="text" placeholder="Buscar..." />
            <button className="w-1/3 bg-[#216eaf] text-white px-4 py-2">Buscar</button>
        </span>
    )
}