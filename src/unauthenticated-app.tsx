/** @jsxImportSource @emotion/react */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {Input, Button, Spinner, FormGroup, ErrorMessage} from './components/lib'
import {Modal, ModalContents, ModalOpenButton} from './components/modal'
import {Logo} from './components/logo'
import {useAuth} from './context/auth-context'
import {useAsync} from './utils/hooks'
import {User, UserInput} from 'types'

interface FormData extends HTMLFormControlsCollection {
	username: HTMLInputElement | string
	password: HTMLInputElement | string
}

interface FormElement extends HTMLFormElement {
	readonly elements: FormData
}

interface LoginProps {
	onSubmit: ({username, password}: UserInput) => Promise<User>
	submitButton: React.ReactElement
}

function LoginForm({onSubmit, submitButton}: LoginProps) {
	const {isLoading, isError, error, run} = useAsync()
	function handleSubmit(event: React.FormEvent<FormElement>) {
		event.preventDefault()
		const {username, password} = event.currentTarget.elements

		run(
			onSubmit({
				username:
					typeof username === 'string' ? username : username.value,
				password:
					typeof password === 'string' ? password : password.value,
			}),
		)
	}

	return (
		<form
			onSubmit={handleSubmit}
			css={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'stretch',
				'> div': {
					margin: '10px auto',
					width: '100%',
					maxWidth: '300px',
				},
			}}
		>
			<FormGroup>
				<label htmlFor="username">Имя пользователя</label>
				<Input id="username" />
			</FormGroup>
			<FormGroup>
				<label htmlFor="password">Пароль</label>
				<Input id="password" type="password" />
			</FormGroup>
			<div>
				{React.cloneElement(
					submitButton,
					{type: 'submit'},
					...(Array.isArray(submitButton.props.children)
						? submitButton.props.children
						: [submitButton.props.children]),
					isLoading ? <Spinner css={{marginLeft: 5}} /> : null,
				)}
			</div>
			{isError ? <ErrorMessage error={error} /> : null}
		</form>
	)
}

export default function UnauthenticatedApp() {
	const {login, register} = useAuth()
	return (
		<div
			css={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100vh',
			}}
		>
			<Logo width="80" height="80" />
			<h1>Bookshelf</h1>
			<div
				css={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
					gridGap: '0.75rem',
				}}
			>
				<Modal>
					<ModalOpenButton>
						<Button variant="primary">Войти</Button>
					</ModalOpenButton>
					<ModalContents aria-label="Login form" title="Login">
						<LoginForm
							onSubmit={login}
							submitButton={
								<Button variant="primary">Войти</Button>
							}
						/>
					</ModalContents>
				</Modal>
				<Modal>
					<ModalOpenButton>
						<Button variant="secondary">Зарегистрироваться</Button>
					</ModalOpenButton>
					<ModalContents
						aria-label="Registration form"
						title="Register"
					>
						<LoginForm
							onSubmit={register}
							submitButton={
								<Button variant="secondary">Зарегистрироваться</Button>
							}
						/>
					</ModalContents>
				</Modal>
			</div>
		</div>
	)
}
