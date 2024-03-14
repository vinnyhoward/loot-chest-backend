import { User } from "../types";

const html = String.raw;

export const emailHtml = (token: string, user: User) => {
  console.log("url:", `${process.env.SITE_URL}/?reset-password-token=${token}`);
  return html`
    <div>
      <div class="a3s aiL msg-4646318626165881899">
        <div bgcolor="#ffffff" style="background:#ffffff">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="background:#ffffff"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="margin-left:auto;margin-right:auto"
                    width="600"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            style="border-collapse:collapse"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="min-width:100%"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr
                                        style="white-space:nowrap;background-color:#ffffff"
                                      >
                                        <td
                                          class="m_-4646318626165881899stack m_-4646318626165881899center"
                                          style="white-space:normal;background-color:#ffffff;padding-top:15px;padding-right:0px;padding-bottom:15px;padding-left:0px"
                                        >
                                          <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  class="m_-4646318626165881899snippet-logo"
                                                  align="left"
                                                >
                                                  <a
                                                    href="https://main--lootchest.netlify.app/"
                                                    target="_blank"
                                                    ><img
                                                      src="https://i.ibb.co/BjwmwRC/temp-logo.png"
                                                      width="250"
                                                      border="0"
                                                  /></a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="min-width:100%"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr
                                        style="white-space:nowrap;background-color:#ffffff"
                                      >
                                        <td
                                          class="m_-4646318626165881899stack"
                                          style="color:#253138;text-align:left;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;white-space:normal;background-color:#ffffff;padding-top:15px;padding-right:0px;padding-bottom:15px;padding-left:0px"
                                        >
                                          Hello ${user.username}!<br /><br />

                                          Your Loot Chest username is:
                                          <strong>${user.username}</strong
                                          ><br />
                                          If you forgot your password:<br />
                                          <a
                                            href="${process.env
                                              .SITE_URL}?reset-password-token=${token}"
                                            style="background:#8847ff;padding:10px 20px;color:#fff;font-size:.85rem;text-decoration:none;display:inline-block;border-radius:4px;margin:0 auto;margin-top:20px"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            >Reset Password</a
                                          ><br /><br />
                                          If you did not make this request, your
                                          email address may have been entered by
                                          mistake and you can safely disregard
                                          this email. <br /><br />
                                          If you have any questions or concerns,
                                          please contact us at
                                          <a
                                            href="mailto:support@lootchest.com"
                                            target="_blank"
                                            >support@lootchest.com</a
                                          >.<br /><br />
                                          Thank you!<br />
                                          The Loot Chest Team
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="min-width:100%;border-collapse:collapse"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr
                                        style="white-space:nowrap;background-color:#ffffff"
                                      >
                                        <td
                                          class="m_-4646318626165881899stack"
                                          style="white-space:normal;padding-right:0px;padding-left:0px;padding-top:25px;padding-bottom:25px"
                                        >
                                          <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="margin-right:auto;margin-left:auto;border-collapse:separate"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  height="0"
                                                  style="font-size:0px;line-height:0px;border-bottom-width:1;border-bottom-color:#e7e8e9;border-bottom-style:solid;font-family:Arial,Helvetica,sans-serif"
                                                >
                                                  &nbsp;
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="min-width:100%"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr
                                        style="white-space:nowrap;background-color:#ffffff"
                                      >
                                        <td
                                          class="m_-4646318626165881899stack"
                                          style="padding-top:5px;padding-right:0px;padding-bottom:5px;padding-left:0px;background-color:#ffffff"
                                        >
                                          <table
                                            role="presentation"
                                            width="100%"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            style="min-width:100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  align="left"
                                                  style="padding-top:10px;color:#253138;text-align:left;font-family:Arial,Helvetica,sans-serf;font-size:12px;line-height:18px"
                                                >
                                                  <div
                                                    style="margin-bottom:15px"
                                                  >
                                                    <span style="color:#253138"
                                                      >You have received this
                                                      mandatory notification to
                                                      update you about changes
                                                      to your Loot Chest
                                                      account.</span
                                                    >
                                                  </div>
                                                  <div
                                                    style="margin-bottom:5px"
                                                  >
                                                    <span style="color:#253138"
                                                      ><a
                                                        href="https://main--lootchest.netlify.app/"
                                                        style="color:#253138;text-decoration:none"
                                                        target="_blank"
                                                        >© 2024 Loot Chest
                                                        Inc.</a
                                                      ></span
                                                    >
                                                  </div>
                                                  <div
                                                    style="margin-bottom:5px"
                                                  >
                                                    <span style="color:#253138"
                                                      >123 Fake Street #911,
                                                      Know where, Space
                                                      9999&nbsp; &nbsp; &nbsp;
                                                      &nbsp; &nbsp;</span
                                                    ><span
                                                      style="display:none;font-size:4px;color:#ffffff"
                                                      ><a
                                                        href="https://main--lootchest.netlify.app/"
                                                        style="color:#ffffff"
                                                        target="_blank"
                                                        >X</a
                                                      ></span
                                                    >
                                                  </div>
                                                  <div>
                                                    <span style="color:#253138"
                                                      ><a
                                                        href="https://main--lootchest.netlify.app/"
                                                        style="color:#253138;text-decoration:underline"
                                                        target="_blank"
                                                        >Privacy Policy</a
                                                      ></span
                                                    >
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};
