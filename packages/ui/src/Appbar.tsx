import { Button } from "./button";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    // TODO: can u figure out what the type should be here?
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b px-4">
        <div className="text-lg flex flex-col justify-center">
            PayTM
        </div>
        <div className="flex flex-col justify-center pt-2 flex-row items-center gap-3">
            {user && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {/* Simple SVG user icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="#E5E7EB"/>
                        <path d="M12 12c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm0 2c-2.67 0-8 1.336-8 4v2h16v-2c0-2.664-5.33-4-8-4z" fill="#9CA3AF"/>
                    </svg>
                </div>
            )}
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}