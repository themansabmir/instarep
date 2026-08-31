"use client";

import * as React from "react";
import { Bot, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import {
  AIAction,
  AIActivity,
  AIIndicator,
  AIStatus,
  IntentBadge,
  PersonaBadge,
  ThinkingIndicator,
} from "@repo/ui/components/ai";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Avatar, AvatarGroup } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  AffiliateCard,
  ProductCard,
  ProductMiniCard,
  RecommendationCard,
} from "@repo/ui/components/commerce";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandMenu,
} from "@repo/ui/components/command";
import {
  Conversation,
  ConversationHeader,
  ConversationPreview,
  MessageComposer,
  MessageList,
  SystemMessage,
  UserMessage,
} from "@repo/ui/components/conversation";
import { AIMessage } from "@repo/ui/components/ai";
import {
  MetricCard,
  MiniChart,
  Progress,
  ProgressRing,
  Sparkline,
  Stat,
} from "@repo/ui/components/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { EmptyState } from "@repo/ui/components/feedback";
import { Input } from "@repo/ui/components/input";
import { InputGroup, PasswordInput, SearchInput } from "@repo/ui/components/input-group";
import {
  Container,
  Divider,
  Grid,
  Inline,
  Section,
  SectionHeader,
  SectionLabel,
  Stack,
} from "@repo/ui/components/layout";
import { MediaCard } from "@repo/ui/components/media";
import { Breadcrumb, Navbar, Sidebar, SidebarItem, TopBar } from "@repo/ui/components/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import {
  ConversionIndicator,
  RevenueBadge,
  RevenueCard,
  RevenueEvent,
  RevenuePipeline,
} from "@repo/ui/components/revenue";
import {
  ConversationSkeleton,
  CardSkeleton,
  MetricSkeleton,
  ProfileSkeleton,
  TableSkeleton,
} from "@repo/ui/components/skeleton";
import {
  InstagramComment,
  InstagramPost,
  InstagramProfile,
  InstagramReel,
  InstagramStory,
} from "@repo/ui/components/social";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
import { TestimonialCard, TestimonialCarousel, LogoCloud } from "@repo/ui/components/testimonial";
import { ThemeToggle } from "@repo/ui/components/theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { Display, Heading, Text } from "@repo/ui/components/typography";

const colorTokens = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["subtle", "bg-subtle"],
  ["elevated", "bg-elevated"],
  ["card", "bg-card"],
  ["primary", "bg-primary"],
  ["brand", "bg-brand"],
  ["ai", "bg-ai"],
  ["revenue", "bg-revenue"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["destructive", "bg-destructive"],
  ["muted", "bg-muted"],
  ["border", "bg-border"],
] as const;

function ShowcaseSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-border scroll-mt-20 space-y-4 border-b py-10 last:border-0">
      <SectionLabel>{title}</SectionLabel>
      {children}
    </section>
  );
}

export function DesignSystemShowcase() {
  const [commandOpen, setCommandOpen] = React.useState(false);

  return (
    <div className="min-h-dvh">
      <TopBar className="bg-background/90 sticky top-0 z-20 backdrop-blur">
        <span className="text-sm font-semibold">Instabot · Design system</span>
        <span className="ml-auto" />
        <ThemeToggle />
      </TopBar>

      <Container className="py-10">
        <div className="max-w-2xl space-y-3">
          <SectionLabel dot tone="ai">
            INTERNAL · NOT CUSTOMER FACING
          </SectionLabel>
          <Display className="text-4xl sm:text-5xl md:text-6xl">Component foundation</Display>
          <Text className="text-muted-foreground">
            Semantic tokens, shadcn primitives, and Instabot product language. Change a token here
            and every consuming app follows.
          </Text>
        </div>

        <nav className="text-caption mt-8 flex flex-wrap gap-2">
          {[
            "Colors",
            "Typography",
            "Buttons",
            "Inputs",
            "Cards",
            "Avatars",
            "Badges",
            "AI",
            "Conversation",
            "Social",
            "Product",
            "Revenue",
            "Navigation",
            "Feedback",
            "Loading",
            "Motion",
          ].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="border-border text-muted-foreground hover:text-foreground rounded-md border px-2 py-1"
            >
              {item}
            </a>
          ))}
        </nav>

        <ShowcaseSection id="colors" title="Colors">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {colorTokens.map(([name, cls]) => (
              <div key={name} className="space-y-1.5">
                <div className={`border-border h-14 rounded-lg border ${cls}`} />
                <p className="text-caption text-muted-foreground">{name}</p>
              </div>
            ))}
          </div>
          <Inline gap="3">
            <div className="bg-gradient-instagram h-10 w-40 rounded-lg" />
            <div className="bg-gradient-brand h-10 w-40 rounded-lg" />
            <div className="bg-gradient-ai h-10 w-40 rounded-lg" />
            <div className="bg-gradient-revenue h-10 w-40 rounded-lg" />
          </Inline>
        </ShowcaseSection>

        <ShowcaseSection id="typography" title="Typography">
          <Stack gap="3">
            <Display className="text-4xl sm:text-6xl">Display</Display>
            <Heading level={1}>Heading one</Heading>
            <Heading level={2}>Heading two</Heading>
            <Heading level={3}>Heading three</Heading>
            <Heading level={4}>Heading four</Heading>
            <Text size="lg">Large body for supporting copy on marketing and empty states.</Text>
            <Text>Body copy for product interfaces. 15px, regular weight.</Text>
            <Text size="caption">Caption · metadata and timestamps</Text>
            <SectionLabel dot tone="brand">
              AI PERSONA · ACTIVE
            </SectionLabel>
          </Stack>
        </ShowcaseSection>

        <ShowcaseSection id="buttons" title="Buttons">
          <Inline>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="brand" leftIcon={<Sparkles />}>
              Create AI Persona
            </Button>
            <Button variant="gradient">Gradient CTA</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button loading>Saving</Button>
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="lg">LG</Button>
            <Button disabled>Disabled</Button>
          </Inline>
        </ShowcaseSection>

        <ShowcaseSection id="inputs" title="Inputs">
          <Grid cols={2}>
            <InputGroup label="Workspace name" hint="Shown to your team.">
              <Input placeholder="Maya Beauty" />
            </InputGroup>
            <InputGroup label="Search">
              <SearchInput placeholder="Search conversations" />
            </InputGroup>
            <InputGroup label="Password">
              <PasswordInput placeholder="••••••••" />
            </InputGroup>
            <InputGroup label="Notes" error="Required">
              <Textarea state="error" placeholder="Add context" />
            </InputGroup>
          </Grid>
        </ShowcaseSection>

        <ShowcaseSection id="cards" title="Cards">
          <Grid cols={3}>
            <Card>
              <CardHeader>
                <CardTitle>Default</CardTitle>
                <CardDescription>Subtle border and shadow.</CardDescription>
              </CardHeader>
              <CardContent>Use for dense product content.</CardContent>
            </Card>
            <Card variant="subtle">
              <CardHeader>
                <CardTitle>Subtle</CardTitle>
                <CardDescription>Tinted surface, no elevation.</CardDescription>
              </CardHeader>
            </Card>
            <Card variant="ai">
              <CardHeader>
                <CardTitle>AI</CardTitle>
                <CardDescription>Purple/pink identity, restrained.</CardDescription>
              </CardHeader>
            </Card>
            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive</CardTitle>
                <CardDescription>Hover border and background.</CardDescription>
              </CardHeader>
            </Card>
            <Card variant="revenue">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Warm accent, not neon green.</CardDescription>
              </CardHeader>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Outline</CardTitle>
                <CardDescription>Transparent fill.</CardDescription>
              </CardHeader>
            </Card>
          </Grid>
        </ShowcaseSection>

        <ShowcaseSection id="avatars" title="Avatars">
          <Inline gap="4">
            <Avatar fallback="MK" size="xs" status="online" />
            <Avatar fallback="MK" size="sm" status="active" />
            <Avatar fallback="AI" size="md" status="ai-active" />
            <Avatar fallback="IG" size="lg" status="offline" />
            <Avatar fallback="TM" size="xl" />
            <AvatarGroup>
              <Avatar fallback="A" />
              <Avatar fallback="B" />
              <Avatar fallback="C" />
              <Avatar fallback="D" />
              <Avatar fallback="E" />
            </AvatarGroup>
          </Inline>
        </ShowcaseSection>

        <ShowcaseSection id="badges" title="Badges">
          <Inline>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="brand">LIVE</Badge>
            <Badge variant="ai">AI ACTIVE</Badge>
            <Badge variant="success">CONNECTED</Badge>
            <Badge variant="warning">PENDING</Badge>
            <Badge variant="destructive">ERROR</Badge>
            <Badge variant="revenue">AFFILIATE</Badge>
            <PersonaBadge>Beauty Advisor</PersonaBadge>
            <IntentBadge />
          </Inline>
        </ShowcaseSection>

        <ShowcaseSection id="ai" title="AI Components">
          <Grid cols={2}>
            <AIActivity title="Beauty Advisor">
              <ThinkingIndicator />
            </AIActivity>
            <Stack>
              <AIStatus />
              <Inline>
                <AIIndicator />
                <AIAction>Create AI Persona</AIAction>
              </Inline>
            </Stack>
          </Grid>
        </ShowcaseSection>

        <ShowcaseSection id="conversation" title="Conversation">
          <Grid cols={2}>
            <Conversation>
              <ConversationHeader
                title="maya.k"
                subtitle="Instagram · 2m"
                avatar={<Avatar fallback="MK" size="sm" />}
              />
              <MessageList>
                <SystemMessage>Intent detected · skincare SPF</SystemMessage>
                <UserMessage>Do you have a lightweight SPF?</UserMessage>
                <AIMessage>I can recommend a mineral SPF 50 that layers under makeup.</AIMessage>
              </MessageList>
              <MessageComposer />
            </Conversation>
            <Stack>
              <ConversationPreview
                name="maya.k"
                preview="Do you have a lightweight SPF?"
                time="2m"
                unread
              />
              <ConversationPreview name="studio.north" preview="Collab next month?" time="1h" />
            </Stack>
          </Grid>
        </ShowcaseSection>

        <ShowcaseSection id="social" title="Social">
          <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_minmax(0,14rem)_1fr]">
            <InstagramPost
              username="maya.k"
              caption="Morning SPF that doesn’t pill."
              likes="12,403"
              comments="View all 84 comments"
            />
            <InstagramReel username="maya.k" caption="Routine in 15s" engagement="84K plays" />
            <Stack>
              <InstagramProfile
                name="Maya Kapoor"
                username="maya.k"
                bio="Beauty creator"
                followers="412K"
              />
              <Inline>
                <InstagramStory username="maya" />
                <InstagramStory username="north" seen />
              </Inline>
              <InstagramComment
                author="maya.k"
                body="This formula is unbeatable in humidity."
                time="3h"
              />
            </Stack>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="product" title="Product">
          <Grid cols={3}>
            <ProductCard
              name="Lightweight SPF 50"
              price="₹1,299"
              discount="₹1,599"
              rating="4.8"
              affiliate
              commission="12%"
            />
            <RecommendationCard
              reason="Matched to SPF intent"
              name="Vitamin C serum"
              price="₹2,199"
              affiliate
              commission="8%"
            />
            <Stack>
              <ProductMiniCard name="Lip oil" price="₹899" commission="10%" />
              <AffiliateCard name="Setting spray" price="₹1,099" commission="15%" />
            </Stack>
          </Grid>
        </ShowcaseSection>

        <ShowcaseSection id="revenue" title="Revenue">
          <Grid cols={3}>
            <RevenueCard label="Attributed revenue" value="₹4.2L" hint="Last 30 days" />
            <MetricCard label="Conversations" value="1,284" trend="12%" trendDirection="up" />
            <Card className="p-4">
              <Stat label="Conversion" value="3.4%" />
              <div className="mt-3 flex items-center gap-3">
                <ProgressRing value={34} />
                <Sparkline points={[4, 8, 6, 12, 9, 16, 14, 18]} />
              </div>
            </Card>
          </Grid>
          <RevenuePipeline activeIndex={3} />
          <RevenueEvent title="SPF 50 click → order" amount="₹1,299" time="2 min ago" />
          <Inline>
            <RevenueBadge state="opportunity">Opportunity</RevenueBadge>
            <RevenueBadge state="pending">Pending</RevenueBadge>
            <RevenueBadge state="converted">Converted</RevenueBadge>
            <RevenueBadge state="attributed">Attributed</RevenueBadge>
            <ConversionIndicator value="8.2%" />
          </Inline>
          <Progress value={64} label="Campaign fill" />
          <MiniChart points={[2, 4, 3, 8, 7, 12, 10, 14]} />
        </ShowcaseSection>

        <ShowcaseSection id="navigation" title="Navigation">
          <div className="flex min-h-64 overflow-hidden rounded-xl border">
            <Sidebar>
              <div className="px-3 py-4 text-sm font-semibold">Instabot</div>
              <nav className="flex flex-1 flex-col gap-0.5 px-2">
                {[
                  "Overview",
                  "AI Personas",
                  "Conversations",
                  "Campaigns",
                  "Knowledge",
                  "Products",
                  "Analytics",
                ].map((item, index) => (
                  <SidebarItem key={item} active={index === 0}>
                    {item}
                  </SidebarItem>
                ))}
                <Divider className="my-2" />
                <SidebarItem>Settings</SidebarItem>
              </nav>
            </Sidebar>
            <div className="flex-1 space-y-4 p-4">
              <Navbar>
                <Breadcrumb
                  items={[{ label: "Overview", href: "#" }, { label: "Design system" }]}
                />
              </Navbar>
              <Tabs defaultValue="one">
                <TabsList>
                  <TabsTrigger value="one">Overview</TabsTrigger>
                  <TabsTrigger value="two">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="one">Compact tabs for product density.</TabsContent>
                <TabsContent value="two">Second panel.</TabsContent>
              </Tabs>
              <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
                Open command menu
              </Button>
              <CommandMenu open={commandOpen} onOpenChange={setCommandOpen}>
                <CommandInput placeholder="Jump to…" />
                <CommandList>
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup heading="Pages">
                    <CommandItem>AI Personas</CommandItem>
                    <CommandItem>Conversations</CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandMenu>
            </div>
          </div>
        </ShowcaseSection>

        <ShowcaseSection id="feedback" title="Feedback">
          <Stack>
            <Alert>
              <AlertTitle>Workspace ready</AlertTitle>
              <AlertDescription>
                Connect Instagram to start attributing conversations.
              </AlertDescription>
            </Alert>
            <Alert variant="ai">
              <AlertTitle>Persona is live</AlertTitle>
              <AlertDescription>Replies will use the Beauty Advisor voice.</AlertDescription>
            </Alert>
            <EmptyState
              icon={Bot}
              title="No AI personas yet."
              description="Create a persona that can represent your brand across Instagram."
              action={<Button>Create Persona</Button>}
            />
            <Inline>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create persona</DialogTitle>
                    <DialogDescription>
                      Reusable overlay with focus trap and Escape to close.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Popover</Button>
                </PopoverTrigger>
                <PopoverContent>Compact popover surface.</PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Brand-aware focus and hover.</TooltipContent>
              </Tooltip>
              <Button
                variant="secondary"
                onClick={() =>
                  toast("Persona created", { description: "Beauty Advisor is active." })
                }
              >
                Toast
              </Button>
            </Inline>
            <Accordion type="single" collapsible>
              <AccordionItem value="a">
                <AccordionTrigger>What is a persona?</AccordionTrigger>
                <AccordionContent>
                  A reusable AI voice trained on your brand knowledge.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Stack>
        </ShowcaseSection>

        <ShowcaseSection id="loading" title="Loading">
          <Grid cols={2}>
            <ConversationSkeleton />
            <Stack>
              <CardSkeleton />
              <MetricSkeleton />
              <ProfileSkeleton />
              <TableSkeleton rows={3} />
            </Stack>
          </Grid>
        </ShowcaseSection>

        <ShowcaseSection id="motion" title="Motion">
          <Inline>
            <div className="animate-fade rounded-lg border px-3 py-2">fade</div>
            <div className="animate-fade-up rounded-lg border px-3 py-2">fade-up</div>
            <div className="animate-scale-in rounded-lg border px-3 py-2">scale-in</div>
            <div className="bg-gradient-brand bg-size-200 animate-gradient-shift rounded-lg border px-3 py-2 text-white">
              gradient-shift
            </div>
          </Inline>
          <div className="bg-subtle relative overflow-hidden rounded-xl border p-8">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="bg-brand-glow pointer-events-none absolute inset-0" />
            <p className="relative text-sm">
              Subtle grid + brand glow — optional, not default chrome.
            </p>
          </div>
          <MediaCard ratio="16/9">
            <div className="text-caption text-muted-foreground p-3">Media 16:9</div>
          </MediaCard>
          <LogoCloud logos={[{ name: "North Studio" }, { name: "Atelier" }, { name: "Kindred" }]} />
          <TestimonialCarousel>
            <TestimonialCard
              quote="Instabot feels like adding another person to my team."
              name="Maya"
              role="Beauty Creator"
            />
            <TestimonialCard
              quote="The AI actually understands purchase intent in DMs."
              name="Arjun"
              role="Agency lead"
            />
          </TestimonialCarousel>
        </ShowcaseSection>

        <Section>
          <SectionHeader
            label="LAYOUT"
            title="Section primitives"
            description="Container max-width, section spacing, and stacks for consistent product pages."
          />
        </Section>
      </Container>
    </div>
  );
}
