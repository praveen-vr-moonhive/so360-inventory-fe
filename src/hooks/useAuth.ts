import { useContext } from 'react';
import { ShellContext, useEntitlements } from '@so360/shell-context';
import { User } from '../types/inventory';

export const useAuth = () => {
    const shell = useContext(ShellContext);
    const user = shell?.user as User | undefined;
    const { can: checkPermission } = useEntitlements();

    const can = (action: string) => {
        // Use real permission check from useEntitlements
        return checkPermission(action);
    };

    return {
        user: shell?.user,
        org_id: shell?.currentOrg?.id,
        can
    };
};
