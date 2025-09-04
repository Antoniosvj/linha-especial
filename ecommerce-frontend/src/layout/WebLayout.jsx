import { Header } from "../components";
export const WebLayout = ({ children }) =>{
    return(
        <div>
            <Header />
            <main>
                {children}
            </main>
        </div>
    )
}