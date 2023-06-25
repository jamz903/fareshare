import { useSelector } from 'react-redux';
import RequireAuth from '../../components/RequireAuth';
import NavBarLayout from '../../layouts/NavBarLayout';
import { useEffect, useState } from 'react';
import RiceBowl from '../../components/RiceBowl';

// axios
import axios from 'axios';
import Cookies from 'js-cookie';

function Home() {
    // const username = useSelector(state => state.auth.username);

    const [expense, setExpense] = useState(0);

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
                return res.data
            }).catch(err => {
                console.err(err)
            })
        setExpense(calculateExpenses(response));
    }

    const calculateExpenses = (receiptsArray) => {
        return receiptsArray.reduce((total, receipt) => {
            return total + receipt.my_expenses
        }, 0);
    }

    useEffect(() => {
        getExpenses();
    }, []);

    return (
        <NavBarLayout navBarText='fareshare'>
            <div className='p-5'>
                <div className='h-40 w-40 flex flex-col place-content-center gap-2 rounded-full border-2 border-green'>
                    <div className='text-sm text-center font-light'>
                        You have spent:
                    </div>
                    <div className='text-3xl text-center'>
                        ${expense}
                    </div>
                </div>
            </div>
        </NavBarLayout>
    );
}

export default Home;