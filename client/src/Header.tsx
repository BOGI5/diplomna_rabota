import { useAuthState } from "./pages/auth/state/state";
import Auth from "./pages/auth/auth";

export default function Header() {
    const isLogged = useAuthState((state) => state.user !== null);
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-dark">
                {isLogged ? (
                    <button 
                        className="btn btn-info nav-btn ms-auto"
                        onClick={
                            () => {
                                useAuthState.getState().removeUser();
                            }
                        }
                    >Logout</button>
                ) : (
                    <Auth />
                )}
            </nav>
        </header>
    );
}