import { useSelector } from 'react-redux';
import RequireAuth from '../../components/RequireAuth';
import NavBarLayout from '../../layouts/NavBarLayout';
import { useEffect, useState } from 'react';
import { DarkSpinner } from '../../components/Spinner';

// axios
import axios from 'axios';
import Cookies from 'js-cookie';

function Home() {
    const username = useSelector(state => state.auth.username);
    const [expense, setExpense] = useState(0);
    const [loadingExpenses, setLoadingExpenses] = useState(true);

    const getExpenses = async () => {
        // set axios config headers
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }
        // get receipts
        const response = await axios.get('/ocr/upload/', config)
            .then(res => {
                setLoadingExpenses(false);
                return res.data
            }).catch(err => {
                console.error(err)
            })
        setExpense(calculateExpenses(response));
    }

    const calculateExpenses = (receiptsArray) => {
        if (!receiptsArray) return 0;
        const num = receiptsArray.reduce((total, receipt) => {
            return total + receipt.my_expenses
        }, 0);
        // truncate to 2 decimal places
        return Math.round(num * 100) / 100;
    }

    useEffect(() => {
        getExpenses();
    }, []);

    return (
        <NavBarLayout navBarText='fareshare'>
            <div className='px-5 flex flex-col gap-5 w-full items-center'>
                {
                    username ?
                        <div>
                            Welcome back, <span className='font-bold'>{username}</span>.
                        </div> :
                        <div>
                            Loading profile...
                        </div>
                }
                {
                    !loadingExpenses ?
                        <div className='h-40 w-40 flex flex-col place-content-center gap-2 rounded-full border-2 border-green'>
                            <div className='text-sm text-center font-light'>
                                You have spent:
                            </div>
                            <div className='text-3xl text-center'>
                                ${expense}
                            </div>
                        </div> :
                        <DarkSpinner />
                }
            </div>
        </NavBarLayout>
    );
}

export default Home;