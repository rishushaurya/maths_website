import {
	Globe,
	Mail,
	Grid2X2Plus,
	MessageCircle,
	Users,
	GraduationCap,
	BookOpen,
} from 'lucide-react';

export function MinimalFooter() {
	const year = new Date().getFullYear();

	const company = [
		{
			title: 'About Us',
			href: '#',
		},
		{
			title: 'Careers',
			href: '#',
		},
		{
			title: 'Brand assets',
			href: '#',
		},
		{
			title: 'Privacy Policy',
			href: '#',
		},
		{
			title: 'Terms of Service',
			href: '#',
		},
	];

	const resources = [
		{
			title: 'Blog',
			href: '#',
		},
		{
			title: 'Help Center',
			href: '#',
		},
		{
			title: 'Contact Support',
			href: '#',
		},
		{
			title: 'Community',
			href: '#',
		},
		{
			title: 'Security',
			href: '#',
		},
	];

	const socialLinks = [
		{
			icon: <Globe className="size-4" />,
			link: '#',
		},
		{
			icon: <Mail className="size-4" />,
			link: '#',
		},
		{
			icon: <MessageCircle className="size-4" />,
			link: '#',
		},
		{
			icon: <Users className="size-4" />,
			link: '#',
		},
		{
			icon: <GraduationCap className="size-4" />,
			link: '#',
		},
		{
			icon: <BookOpen className="size-4" />,
			link: '#',
		},
	];
	return (
		<footer className="relative w-full z-20 font-mono transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
			<div className="mx-auto max-w-4xl md:border-x transition-colors duration-500" style={{ borderColor: 'var(--border)' }}>
				<div className="absolute inset-x-0 h-px w-full transition-colors duration-500" style={{ background: 'var(--border)' }} />
				<div className="grid max-w-4xl grid-cols-6 gap-6 p-4">
					<div className="col-span-6 flex flex-col gap-5 md:col-span-4">
						<a href="#" className="w-max opacity-50 transition-colors duration-500" style={{ color: 'var(--text-primary)' }}>
							<Grid2X2Plus className="size-8" />
						</a>
						<p className="max-w-sm font-mono text-sm text-balance transition-colors duration-500" style={{ color: 'var(--text-secondary)' }}>
							Push past boundaries. The analytical heart of Dayananda Sagar University.
						</p>
						<div className="flex gap-2">
							{socialLinks.map((item, i) => (
								<a
									key={i}
									className="rounded-md border p-1.5 transition-all duration-300 hover:opacity-80"
                                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
									target="_blank"
									href={item.link}
								>
									{item.icon}
								</a>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="mb-1 text-xs uppercase tracking-widest transition-colors duration-500" style={{ color: 'var(--text-muted)' }}>
							Resources
						</span>
						<div className="flex flex-col gap-1">
							{resources.map(({ href, title }, i) => (
								<a
									key={i}
									className={`w-max py-1 text-sm duration-200 hover:underline`}
                                    style={{ color: 'var(--text-primary)' }}
									href={href}
								>
									{title}
								</a>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="mb-1 text-xs uppercase tracking-widest transition-colors duration-500" style={{ color: 'var(--text-muted)' }}>Company</span>
						<div className="flex flex-col gap-1">
							{company.map(({ href, title }, i) => (
								<a
									key={i}
									className={`w-max py-1 text-sm duration-200 hover:underline`}
                                    style={{ color: 'var(--text-primary)' }}
									href={href}
								>
									{title}
								</a>
							))}
						</div>
					</div>
				</div>
				<div className="absolute inset-x-0 h-px w-full transition-colors duration-500" style={{ background: 'var(--border)' }} />
				<div className="flex max-w-4xl flex-col justify-between gap-2 pt-2 pb-5">
					<p className="text-center font-thin text-xs opacity-70 transition-colors duration-500" style={{ color: 'var(--text-secondary)' }}>
						© <a href="/" className="hover:underline">Brahmagupta Mathematics Club</a>. All rights
						reserved {year}
					</p>
				</div>
			</div>
		</footer>
	);
}
