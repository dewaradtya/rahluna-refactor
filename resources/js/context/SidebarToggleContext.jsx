import { createContext, useState } from "react";

const SidebarToggleContext = createContext(false);

const SidebarToggleContextProvider = ({ children }) => {
    const [sidebarToggled, setSidebarToggled] = useState(false);

    return (
        <SidebarToggleContext.Provider
            value={{ sidebarToggled, setSidebarToggled }}
        >
            {children}
        </SidebarToggleContext.Provider>
    );
};

export const SidebarToggle = SidebarToggleContext;
export default SidebarToggleContextProvider;
