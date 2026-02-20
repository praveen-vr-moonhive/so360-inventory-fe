import { useContext } from 'react';
import { ShellContext, useEntitlements } from '@so360/shell-context';
import { User } from '../types/inventory';

export const useAuth = () => {
    const shell = useContext(ShellContext);
    const user = shell?.user as User | undefined;
    const { can: checkPermission, isLoading: permissionsLoading } = useEntitlements();

    const can = (action: string) => {
        // While permissions are still loading, grant access optimistically
        // to prevent UI flash where buttons appear/disappear
        if (permissionsLoading) return true;
        return checkPermission(action);
    };

    return {
        user: shell?.user,
        org_id: shell?.currentOrg?.id,
        can,
        isLoading: permissionsLoading
    };
};
