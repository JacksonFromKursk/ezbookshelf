/** @jsxImportSource @emotion/react */
import {jsx} from '@emotion/core'

import {Routes, Route, Link as RouterLink, useMatch} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'
import {Button, ErrorMessage, FullPageErrorFallback} from './components/lib'
import * as mq from './styles/media-queries'
import * as colors from './styles/colors'
import {useAuth} from './context/auth-context'
import {ReadingListScreen} from './screens/reading-list'
import {FinishedScreen} from './screens/finished'
import {DiscoverBooksScreen} from './screens/discover'
import {BookScreen} from './screens/book'
import {NotFoundScreen} from './screens/not-found'

function ErrorFallback({error}: {error: Error}) {
	return (
		<ErrorMessage
			error={error}
			css={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		/>
	)
}

export default function AuthenticatedApp() {
	const {user, logout} = useAuth()

	return (
		<ErrorBoundary FallbackComponent={FullPageErrorFallback}>
			<div
				css={{
					display: 'flex',
					alignItems: 'center',
					position: 'absolute',
					top: '10px',
					right: '10px',
				}}
			>
				{user.username}
				<Button
					variant="secondary"
					css={{marginLeft: '10px'}}
					onClick={logout}
				>
					Выйти
				</Button>
			</div>
			<div
				css={{
					margin: '0 auto',
					padding: '4em 2em',
					maxWidth: '840px',
					width: '100%',
					display: 'grid',
					gridGap: '1em',
					gridTemplateColumns: '1fr 3fr',
					[mq.small]: {
						gridTemplateColumns: '1fr',
						gridTemplateRows: 'auto',
						width: '100%',
					},
				}}
			>
				<div css={{position: 'relative'}}>
					<Nav />
				</div>
				<main css={{width: '100%'}}>
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<AppRoutes />
					</ErrorBoundary>
				</main>
			</div>
		</ErrorBoundary>
	)
}

function NavLink({to, children}: {to: string; children: string}) {
	const match = useMatch(to)
	return (
		<RouterLink
			css={[
				{
					display: 'block',
					padding: '8px 15px 8px 10px',
					margin: '5px 0',
					width: '100%',
					height: '100%',
					color: colors.text,
					borderRadius: '2px',
					borderLeft: '5px solid transparent',
					':hover,:focus': {
						color: colors.indigo,
						textDecoration: 'none',
						background: colors.gray10,
					},
				},
				match
					? {
							borderLeft: `5px solid ${colors.indigo}`,
							background: colors.gray10,
							':hover,:focus': {
								background: colors.gray10,
							},
					  }
					: null,
			]}
			to={to}
		>
			{children}
		</RouterLink>
	)
}

function Nav() {
	return (
		<nav
			css={{
				position: 'sticky',
				top: '4px',
				padding: '1em 1.5em',
				border: `1px solid ${colors.gray10}`,
				borderRadius: '3px',
				[mq.small]: {
					position: 'static',
					top: 'auto',
				},
			}}
		>
			<ul
				css={{
					listStyle: 'none',
					padding: '0',
				}}
			>
				<li>
					<NavLink to="/list">Список книг</NavLink>
				</li>
				<li>
					<NavLink to="/finished">Законченные книги</NavLink>
				</li>
				<li>
					<NavLink to="/discover">Библиотека</NavLink>
				</li>
			</ul>
		</nav>
	)
}

function AppRoutes() {
	return (
		<Routes>
			<Route path="/list" element={<ReadingListScreen />} />
			<Route path="/finished" element={<FinishedScreen />} />
			<Route path="/discover" element={<DiscoverBooksScreen />} />
			<Route path="/book/:bookId" element={<BookScreen />} />
			<Route path="*" element={<NotFoundScreen />} />
		</Routes>
	)
}
