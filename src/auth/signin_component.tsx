import * as React from 'react';
import { EZSubmissionClient, createSingleAnswer } from '../ezsubmission/client';
import { EZSubmissionSession } from './session';
import Swal from 'sweetalert2';
import { Toast } from '../alerts/toast';

export default function SigninComponent(props: { client: EZSubmissionClient, session: EZSubmissionSession, fnGetAnswer: () => any }) {
    const [username, setUsername] = React.useState<string>('');

    // when mounting, check if there is a token in the session
    React.useEffect(() => {
        if (props.session.isLoggedIn()) {
            setUsername(props.session.getLoggedInUsername());
        }
    });

    const handleLoginClick = async () => {
        console.log('login clicked')
        const username = await Swal.fire({
            title: "Digite seu nome de usuário",
            input: 'text',
            showCancelButton: true,
        });
        if (username.dismiss) {
            return;
        }
        const password = await Swal.fire({
            title: "Digite sua senha",
            input: 'password',
            showCancelButton: true,
        });
        if (password.dismiss) {
            return;
        }

        try {
            const response = await props.client.login(username.value, password.value);
            props.session.setToken(response.data.access_token);
            Toast.fire({
                icon: 'success',
                title: 'Login efetuado com sucesso'
            });
            setUsername(username.value);
        } catch (e) {
            console.log(e);
            await Swal.fire({
                text: 'Erro ao fazer login',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    const handleLogoutClick = () => {
        props.session.setToken(null);
        setUsername(null);
    }

    async function submitAnswer() {
        try {
            const answer = createSingleAnswer(
                props.fnGetAnswer(),
                window.location.href,    
            )
            const response = await props.client.submit(answer);
            console.log(response);
            await Swal.fire({
                text: 'Sua resposta foi enviada com sucesso!',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        } catch (e) {
            console.log(e);
            await Swal.fire({
                text: 'Erro ao enviar resposta',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    return (
        <>
            <span><a href="https://forms.gle/xuwJ7gwirRJJNx2e9" target="_blank" rel="noopener noreferrer">Avaliar</a></span>
            &nbsp;
            {username ? (
                <>
                
                <span>Olá, {username}! <button onClick={handleLogoutClick}>Sair</button></span>
                &nbsp;
                <button onClick={submitAnswer}>Enviar solução</button>
                </>
            ) : (
                <span><button onClick={handleLoginClick}>Fazer login</button></span>
            )}
        </>
    )
}
