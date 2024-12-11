import {useApplicationInfoStore} from '@/shared/stores/useApplicationInfoStore';
import {useAuthenticationStore} from '@/shared/stores/useAuthenticationStore';
import {cleanup, render, screen, userEvent, waitFor} from '@/shared/util/test-utils';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {Mock, afterEach, beforeEach, expect, it, vi} from 'vitest';

import Login from '../Login';
import PasswordResetInit from '../PasswordResetInit';
import Register from '../Register';

screen.debug();

const renderLoginPage = () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route element={<Login />} path="/login" />
            </Routes>
        </MemoryRouter>
    );
};

vi.mock('@/shared/stores/useApplicationInfoStore', () => ({
    useApplicationInfoStore: vi.fn(),
}));

vi.mock('@/shared/stores/useAuthenticationStore', () => ({
    useAuthenticationStore: vi.fn(),
}));

beforeEach(() => {
    const mockApplicationInfoStore = {
        signUp: {
            activationRequired: false,
            enabled: true,
        },
        // eslint-disable-next-line sort-keys
        getApplicationInfo: vi.fn(),
    };

    (useApplicationInfoStore as unknown as Mock).mockReturnValue(mockApplicationInfoStore);
});

beforeEach(() => {
    const mockAuthenticationStore = {
        authenticated: false,
        login: vi.fn().mockResolvedValue(null),
        loginError: false,
    };

    (useAuthenticationStore as unknown as Mock).mockReturnValue(mockAuthenticationStore);
});

beforeEach(() => {
    window.ResizeObserver = vi.fn(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn(),
    }));
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    if (window.ResizeObserver) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).ResizeObserver;
    }
    vi.resetModules();
});

it('should render the login page on "/login" path', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
});

it('should hide password input on render and toggle "show password" when "show password" icon is clicked', async () => {
    renderLoginPage();

    const passwordInputField = screen.getByLabelText('Password');
    expect(passwordInputField).toHaveAttribute('type', 'password');

    const button = screen.getByRole('button', {name: /Show Passwor/i});
    await userEvent.click(button);
    expect(passwordInputField).toHaveAttribute('type', 'text');

    await userEvent.click(button);
    expect(passwordInputField).toHaveAttribute('type', 'password');
});

it('should not submit form when only "show password" button is clicked', async () => {
    renderLoginPage();

    const showPasswordButton = screen.getByRole('button', {name: /show password/i});

    await userEvent.click(showPasswordButton);

    expect(useAuthenticationStore().login).not.toHaveBeenCalled();
});

it('should render "PasswordResetInit" page if "Forgot your password" is clicked', async () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route element={<Login />} path="/login" />

                <Route element={<PasswordResetInit />} path="/password-reset/init" />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText('Welcome back')).toBeInTheDocument();

    const forgotPasswordButton = screen.getByText('Forgot your password');
    await userEvent.click(forgotPasswordButton);

    await waitFor(() => {
        expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
    });
});

it('should render "Register" page if "Create account" is clicked', async () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route element={<Login />} path="/login" />

                <Route element={<Register />} path="/register" />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText('Welcome back')).toBeInTheDocument();

    const createAccountButton = screen.getByText('Create account');
    await userEvent.click(createAccountButton);

    await waitFor(() => {
        expect(screen.getByText('Create your account')).toBeInTheDocument();
    });
});

it('should show "Failed to sign in!" alert if loginError is true', async () => {
    const mockAuthenticationStore = {
        authenticated: false,
        login: vi.fn(),
        loginError: true,
    };

    (useAuthenticationStore as unknown as Mock).mockReturnValue(mockAuthenticationStore);

    renderLoginPage();

    await waitFor(() => {
        expect(screen.getByText('Failed to sign in!')).toBeInTheDocument();
    });
});

it('should submit form with correct login details when "Log in" is clicked', async () => {
    renderLoginPage();

    const emailInputField = screen.getByLabelText('Email');
    const passwordInputField = screen.getByLabelText('Password');
    const stayLoggedInCheckbox = screen.getByRole('checkbox', {name: /stay logged in/i});

    const logInButton = screen.getByRole('button', {name: /log in/i});

    await userEvent.type(emailInputField, 'test@example.com');
    await userEvent.type(passwordInputField, 'password');
    await userEvent.click(stayLoggedInCheckbox);

    await userEvent.click(logInButton);

    await waitFor(() => {
        expect(useAuthenticationStore().login).toHaveBeenCalledWith('test@example.com', 'password', true);
    });
});

it('should show validation errors after clicking "Log in" button, if input fields are empty strings', async () => {
    renderLoginPage();

    const emailInputField = screen.getByLabelText('Email');
    const passwordInputField = screen.getByLabelText('Password');

    const logInButton = screen.getByRole('button', {name: /log in/i});

    await userEvent.type(emailInputField, ' ');
    await userEvent.type(passwordInputField, ' ');

    await userEvent.click(logInButton);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
});

it('should toggle "Stay logged in" checkbox on click', async () => {
    renderLoginPage();

    const checkbox = screen.getByLabelText('Stay logged in');

    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
});

it('should disable submit button and show loading icon while log in credentials are being authenticated', async () => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const mockAuthenticationStore = {
        authenticated: false,
        login: async () => {
            await delay(1000);
        },
        loginError: false,
    };

    (useAuthenticationStore as unknown as Mock).mockReturnValue(mockAuthenticationStore);

    renderLoginPage();

    const logInButton = screen.getByLabelText('log in button');

    expect(logInButton).not.toBeDisabled();
    expect(screen.queryByLabelText('loading icon')).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', {name: /log in/i}));

    expect(logInButton).toBeDisabled();
    expect(screen.getByLabelText('loading icon')).toBeInTheDocument();
});
