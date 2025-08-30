type AppUser = { name: string; email: string };

export default function AppLogo({ user }: { user?: AppUser }) {
    return (
        <>
            {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div> */}
            <div className="ml-1 grid flex-1 text-left text-sm">
                {user ? (
                    <span className="mb-0.5 truncate leading-none font-semibold">{user.name}</span>
                ) : (
                    <span className="mb-0.5 truncate leading-none font-semibold">Guest</span>
                )}
            </div>
        </>
    );
}
