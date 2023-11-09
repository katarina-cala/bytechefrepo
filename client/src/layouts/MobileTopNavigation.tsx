import Button from '@/components/Button/Button';
import {Menu} from 'lucide-react';

import reactLogo from '../assets/logo.svg';

export function MobileTopNavigation({
    setMobileMenuOpen,
}: {
    setMobileMenuOpen: (value: boolean) => void;
}) {
    return (
        <div className="lg:hidden">
            <div className="flex items-center justify-between bg-white px-4 py-2 sm:px-6 lg:px-8">
                <div>
                    <img
                        alt="ByteChef"
                        className="h-8 w-auto"
                        src={reactLogo}
                    />
                </div>

                <div>
                    <Button
                        displayType="icon"
                        icon={<Menu aria-hidden="true" className="h-6 w-6" />}
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
