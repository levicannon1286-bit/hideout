import { Navigation } from "@/components/Navigation";
import { GlobalChat } from "@/components/GlobalChat";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalChat />
      <main className="pt-24 px-4 sm:px-6 pb-12 max-w-4xl mx-auto">
        <Card className="p-8 bg-card border-border">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-foreground">
              <section>
                <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                <p>By creating an account and using Hideout Network, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">2. Account Security</h2>
                <p className="mb-2"><strong className="text-destructive">IMPORTANT:</strong> You are solely responsible for:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Keeping your password secure and confidential</li>
                  <li>All activities that occur under your account</li>
                  <li>Any loss of access to your account</li>
                </ul>
                <p className="mt-3 text-destructive font-medium flex items-center gap-1">
                  <span>⚠</span> If you lose your password or account access, it is completely your fault and not ours. We cannot and will not recover lost accounts under any circumstances.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">3. Account Deletion Policy</h2>
                <p className="mb-2">To maintain database efficiency:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li className="font-medium text-yellow-500">Accounts inactive for 2 weeks will be automatically and permanently deleted</li>
                  <li>All associated data, including favorites and game progress, will be removed</li>
                  <li>You can manually delete your account at any time from the Account page</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">4. User Conduct</h2>
                <p className="mb-2">You agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use the service legally and responsibly</li>
                  <li>Not share your account credentials with others</li>
                  <li>Not attempt to hack, exploit, or abuse the service</li>
                  <li>Not create multiple accounts to circumvent restrictions</li>
                  <li>Not use offensive or inappropriate usernames</li>
                  <li>Use the Hideout Browser responsibly and in compliance with all applicable laws</li>
                  <li>Not use the browser for illegal activities, harassment, or accessing prohibited content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">5. Service Availability</h2>
                <p>We strive to provide continuous service but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without notice.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">6. Limitation of Liability</h2>
                <p className="mb-2">Hideout Network and its operators:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Are not liable for any data loss, including account deletion or browser data</li>
                  <li>Are not responsible for lost or forgotten passwords</li>
                  <li>Provide the service "as is" without warranties of any kind</li>
                  <li>Are not liable for any damages arising from use of the service</li>
                  <li>Are not responsible for content accessed through the Hideout Browser</li>
                  <li>Do not guarantee proxy functionality or access to any specific websites</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">7. Changes to Terms</h2>
                <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">8. Intellectual Property</h2>
                <p className="mb-2">All content and functionality on Hideout Network, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Website design, layout, and graphics</li>
                  <li>Software code and functionality</li>
                  <li>Trademarks, logos, and branding materials</li>
                </ul>
                <p className="mt-3">Are the property of Hideout Network and are protected by copyright and other intellectual property laws.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">9. Disclaimer of Warranties</h2>
                <p className="mb-2">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We make no guarantees about service uptime or availability</li>
                  <li>We are not responsible for content accuracy or completeness</li>
                  <li>We do not warrant that the service will be error-free or uninterrupted</li>
                  <li>We are not liable for any malware, viruses, or other harmful components</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">10. Indemnification</h2>
                <p>You agree to indemnify and hold harmless Hideout Network, its operators, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the service or violation of these terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">11. Termination</h2>
                <p className="mb-2">We reserve the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Terminate or suspend your account at any time without notice</li>
                  <li>Remove content that violates our policies</li>
                  <li>Ban users for inappropriate behavior or Terms violations</li>
                  <li>Modify or discontinue the service at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">12. Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved in appropriate courts with jurisdiction.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">13. Contact</h2>
                <p>For questions or concerns, contact us at: <a href="mailto:hideout-network-buisness@hotmail.com" className="text-primary hover:underline">hideout-network-buisness@hotmail.com</a></p>
              </section>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Terms;