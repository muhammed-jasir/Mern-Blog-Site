import { Footer } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

const FooterComp = () => {
    const sections = [
        {
            title: "Company",
            links: [
                { href: "/about", label: "About" },
                { href: "#", label: "Careers" },
                { href: "#", label: "Our Team" },
                { href: "/projects", label: "Blog" },
            ]
        },
        {
            title: "Help Center",
            links: [
                { href: "#", label: "Support" },
                { href: "#", label: "FAQ" },
                { href: "#", label: "Guides" },
                { href: "/contact", label: "Contact Us" },
            ]
        },
        {
            title: "Legal",
            links: [
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Licensing" },
                { href: "#", label: "Terms & Conditions" },
                { href: "#", label: "Disclaimer" },
            ]
        }
    ];

    return (
        <Footer container className='border border-t-8 border-teal-400 bg-slate-200 dark:bg-slate-800'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className='flex flex-wrap gap-10 sm:justify-between w-full max-sm:flex-col max-sm:gap-4'>
                    <div className='mt-5'>
                        <Link to='/'>
                            <h2 className='flex items-center whitespace-nowrap text-2xl font-semibold dark:text-white'>
                                <span className='bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-3xl px-2 py-1 pb-2 text-white'>The Blog </span> Spot
                            </h2>
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-10 mt-5 sm:grid-cols-3 max-sm:gap-8'>
                        {sections.map((section, index) => (
                            <div key={index}>
                                <Footer.Title title={section.title} />
                                <Footer.LinkGroup col>
                                    {section.links.map((link, index) => (
                                        <Footer.Link
                                            key={index}
                                            href={link.href}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            {link.label}
                                        </Footer.Link>
                                    ))}
                                </Footer.LinkGroup>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex sm:items-center sm:justify-between'>
                    <Footer.Copyright
                        href='#'
                        by='The Blog Spot'
                        year={new Date().getFullYear()}
                        className='dark:text-white'
                    />
                    <div className="mt-5 flex gap-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} target='_blank' />
                        <Footer.Icon href="#" icon={BsInstagram} target='_blank' />
                        <Footer.Icon href="#" icon={BsTwitter} target='_blank' />
                        <Footer.Icon href="#" icon={BsGithub} target='_blank' />
                        <Footer.Icon href="#" icon={BsDribbble} target='_blank' />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterComp;
