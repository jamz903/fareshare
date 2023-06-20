import NavBar from '../components/NavBar';

export default function NavBarLayout({ children, navBarText = 'fareshare', className = '', onClick = () => { } }) {
    return (
        <div className={'w-full h-full flex flex-col items-center ' + className} onClick={onClick}>
            <div className='w-full p-5'>
                <NavBar navBarText={navBarText} />
            </div>
            {children}
        </div>
    )
}