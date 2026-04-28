import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useConfig } from "@/contexts/ConfigContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Calendar, Clock, ArrowLeft, Share2, MessageSquare, ThumbsUp } from "lucide-react";

// Mock data for the blog post
const postData = {
    title: "The Rise of Digital Gifting in 2026",
    author: "Ajay Sharma",
    date: "Jan 10, 2026",
    readTime: "5 min read",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200",
    content: `
        <p class="text-xl text-muted-foreground leading-relaxed mb-8">
            Digital vouchers are no longer just a last-minute gift option. In 2026, they have become the primary way people celebrate milestones, show appreciation, and share joy across borders.
        </p>
        <h2 class="text-3xl font-display font-bold mt-12 mb-6 text-foreground">Changing Consumer Behavior</h2>
        <p class="mb-6">
            The shift towards digital-first experiences has been accelerating for years. Today’s consumers value convenience and personalization above all else. A digital gift card, delivered instantly with a personalized video message, resonates far more than a physical item that might take days to arrive.
        </p>
        <blockquote class="border-l-4 border-primary pl-6 py-2 my-8 italic text-xl text-muted-foreground">
            "Digital gifting is not just about the transaction; it's about the connection that happens in the moment of delivery."
        </blockquote>
        <h2 class="text-3xl font-display font-bold mt-12 mb-6 text-foreground">The Power of Choice</h2>
        <p class="mb-6">
            One of the greatest advantages of digital vouchers is the flexibility they provide. Instead of guessing what someone might want, givers provide the power of choice. This reduces waste and ensures that every gift is something the recipient truly values.
        </p>
        <div class="my-10 rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200" alt="Payment visualization" class="w-full h-auto" />
            <p class="text-center text-sm text-muted-foreground py-4 bg-muted/30">Digital payments are becoming more secure and seamless every day.</p>
        </div>
        <h2 class="text-3xl font-display font-bold mt-12 mb-6 text-foreground">Looking Ahead</h2>
        <p class="mb-6">
            As we look further into 2026, we expect to see even more integration with augmented reality and blockchain technology to make gift cards more interactive and secure. SabbPe is at the forefront of these innovations, ensuring our users always have the best gifting experience.
        </p>
    `
};

export default function SingleBlogPage() {
    const { id } = useParams();
    const { config } = useConfig();
    const [showCommentForm, setShowCommentForm] = useState(false);

    console.log("Blog ID:", id);

    const post = postData;

    useEffect(() => {
        if (post) {
            document.title = `${post.title} | Gift360 Blog`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute("content", `Read about ${post.title} by ${post.author} on Gift360.`);
            }
        }
        window.scrollTo(0, 0);
    }, [id]); // Only scroll on initial load or ID change

    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            {config.header.enabled && <Header />}

            <main className="flex-1 pb-16">
                {/* HERO SECTION */}
                <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none"></div>
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        {/* BREADCRUMB */}
                        <div className="mb-4 md:mb-8">
                            <Breadcrumb>
                                <BreadcrumbList className="text-xs md:text-sm">
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/">Home</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/blogs">Blogs</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="max-w-[100px] md:max-w-none truncate">{post.title}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        {/* TITLE & META */}
                        <div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 md:mb-4 hover:bg-primary/20 transition-colors text-[10px] md:text-xs">
                                {post.category}
                            </Badge>
                            <h1 className="text-3xl md:text-6xl font-display font-bold mb-4 md:mb-6 leading-tight tracking-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground mb-8 md:mb-10 pb-8 md:pb-10 border-b border-border text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/10 font-bold text-sm md:text-base">
                                        {post.author.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-foreground">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* HERO IMAGE */}
                        <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] mb-10 md:mb-16 relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"></div>
                        </div>

                        {/* CONTENT */}
                        <article className="prose prose-lg dark:prose-invert max-w-none mb-16">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </article>

                        {/* FOOTER ACTIONS */}
                        <div className="flex items-center justify-between py-8 border-t border-b border-border mb-16">
                            <div className="flex gap-4">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ThumbsUp className="w-4 h-4" /> 124
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <MessageSquare className="w-4 h-4" /> 18
                                </Button>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/20 text-primary hover:bg-primary/5">
                                <Share2 className="w-4 h-4" /> Share Post
                            </Button>
                        </div>

                        {/* NAVIGATION */}
                        <div className="flex justify-between mb-20">
                            <Link href="/blogs">
                                <Button variant="ghost" className="gap-2 group">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Blogs
                                </Button>
                            </Link>
                        </div>

                        {/* RELATED CATEGORY BLOGS */}
                        <section className="mb-12 md:mb-20">
                            <div className="flex items-center gap-2 mb-6 md:mb-8">
                                <span className="w-1.5 md:w-2 h-6 md:h-8 bg-primary rounded-full"></span>
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Related in {post.category}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { id: 1, title: "Future of E-wallet Vouchers", date: "Jan 12, 2026", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },
                                    { id: 2, title: "Cross-border Gifting Trends", date: "Jan 15, 2026", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600" },
                                    { id: 3, title: "Personalized Digital Experiences", date: "Jan 18, 2026", image: "https://images.unsplash.com/photo-1512428559083-a40ce1204425?auto=format&fit=crop&q=80&w=600" }
                                ].map((blog) => (
                                    <Link key={blog.id} href={`/blogs/${blog.id}`}>
                                        <div className="group cursor-pointer">
                                            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative">
                                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {blog.date}
                                            </p>
                                            <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {blog.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* RECOMMENDED BLOGS */}
                        <section className="mb-12 md:mb-20">
                            <div className="flex items-center gap-2 mb-6 md:mb-8">
                                <span className="w-1.5 md:w-2 h-6 md:h-8 bg-racing-red rounded-full"></span>
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Recommended for You</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { id: 4, title: "How to Save on Luxury Brands", date: "Jan 05, 2026", category: "Guide", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600" },
                                    { id: 5, title: "Top 5 Fashion Vouchers this Winter", date: "Dec 28, 2025", category: "Fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600" },
                                    { id: 6, title: "Gaming Gift Card Security", date: "Dec 15, 2025", category: "Security", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600" }
                                ].map((blog) => (
                                    <Link key={blog.id} href={`/blogs/${blog.id}`}>
                                        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                                            <div className="aspect-video relative overflow-hidden">
                                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                                <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-none">
                                                    {blog.category}
                                                </Badge>
                                            </div>
                                            <div className="p-5">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{blog.date}</p>
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                                    {blog.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* COMMENT SECTION */}
                        <section className="bg-muted/30 rounded-3xl p-6 md:p-12 border border-border/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                    <h2 className="text-2xl md:text-3xl font-display font-bold">Comments (2)</h2>
                                </div>
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowCommentForm(!showCommentForm);
                                    }}
                                    className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold"
                                >
                                    {showCommentForm ? "Cancel" : "Add Comment"}
                                </Button>
                            </div>

                            {/* COMMENT FORM */}
                            {showCommentForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-background rounded-2xl p-6 mb-12 border border-primary/20 shadow-xl"
                                >
                                    <h3 className="text-xl font-bold mb-6">Leave a Reply</h3>
                                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1">Full Name</label>
                                                <input type="text" placeholder="Your Name" className="w-full bg-muted/50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1">Email Address</label>
                                                <input type="email" placeholder="Your Email" className="w-full bg-muted/50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold ml-1">Message</label>
                                            <textarea rows={4} placeholder="Type your comment here..." className="w-full bg-muted/50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"></textarea>
                                        </div>
                                        <Button className="w-full md:w-auto px-12 py-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg">
                                            Post Comment
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {/* COMMENTS LIST */}
                            <div className="space-y-8">
                                {[
                                    {
                                        name: "Rohit Verma",
                                        date: "Jan 11, 2026",
                                        comment: "Great insights! Digital gifting is indeed the future. I've personally started using Gift360 for all my corporate gifts.",
                                        initials: "RV"
                                    },
                                    {
                                        name: "Sneha Kapoor",
                                        date: "Jan 10, 2026",
                                        comment: "I love how easy it is to find brands on this platform. This blog post really explains the value of choice well.",
                                        initials: "SK"
                                    }
                                ].map((c, i) => (
                                    <div key={i} className="flex gap-4 p-6 rounded-2xl bg-background/50 border border-border/30">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 border border-primary/20">
                                            {c.initials}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-foreground">{c.name}</h4>
                                                <span className="text-xs text-muted-foreground">{c.date}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                                                "{c.comment}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </section>
            </main>

            {config.footer.enabled && <Footer />}
            <MobileBottomNav />
        </div>
    );
}
