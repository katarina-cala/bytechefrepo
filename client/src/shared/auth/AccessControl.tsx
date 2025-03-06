import {ReactNode} from 'react';
import {Navigate, useLocation, useSearchParams} from 'react-router-dom';

interface AccessControlProps {
    children: ReactNode;
    requiresFlow?: boolean;
    requiresKey?: boolean;
    noActivationRequired?: boolean;
}

export const AccessControl = ({
    children,
    noActivationRequired = false,
    requiresFlow = false,
    requiresKey = false,
}: AccessControlProps) => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const key = searchParams.get('key');

    const hasActivationKey = Boolean(key);

    const isNoActivationFlow = noActivationRequired ? Boolean(location.state?.noActivationRequired) : true;

    const isFromInternalFlow = requiresFlow ? Boolean(location.state?.fromInternalFlow) : true;

    const shouldRedirectToLogin =
        (requiresKey && !hasActivationKey && !isNoActivationFlow) || (requiresFlow && !isFromInternalFlow);

    if (shouldRedirectToLogin) {
        return <Navigate replace to="/login" />;
    }

    return <>{children}</>;
};
