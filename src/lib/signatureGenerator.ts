import { SignatureData } from "./signatureStorage";

// Helper to sanitize URLs
const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Add http:// if missing
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// Helper to sanitize user inputs
const sanitize = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

export const generateSignatureHTML = (signature: SignatureData): string => {
  const { personalInfo, socialLinks, branding, cta, settings } = signature.data;
  
  // Generate social icons
  const socialIconsHTML = generateSocialIconsHTML(socialLinks, settings.socialIconStyle);
  
  // Use either new or old property names for backward compatibility
  const logoUrl = branding.logoUrl || branding.logo;
  const primaryColor = branding.brandColor || branding.primaryColor;
  const secondaryColor = branding.textColor || branding.secondaryColor;
  const fontFamily = branding.fontFamily || branding.font;
  const buttonColor = cta.buttonColor || cta.color;
  const ctaTextColor = cta.textColor || '#ffffff';
  
  // Company logo
  const logoHTML = logoUrl ? `<img src="${logoUrl}" alt="${sanitize(personalInfo.company)} logo" style="max-height: 60px; max-width: 180px; margin-bottom: 10px;">` : '';
  
  // Profile photo
  const photoHTML = personalInfo.photoUrl ? 
    `<img src="${personalInfo.photoUrl}" alt="${sanitize(personalInfo.name)}" style="border-radius: 50%; width: 80px; height: 80px; object-fit: cover; ${settings.imagePosition === 'none' ? 'display: none;' : ''}">` : '';
  
  // CTA button
  const ctaHTML = cta.text && cta.url ? `
    <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${buttonColor}; color: ${ctaTextColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-top: 10px; font-family: ${fontFamily};">
      ${sanitize(cta.text)}
    </a>
  ` : '';

  // Different layouts based on settings
  let templateHTML = '';
  
  switch (settings.layout) {
    case 'modern':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          <tr>
            <td style="padding-bottom: 15px;" colspan="2">
              ${logoHTML}
            </td>
          </tr>
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' ? 
              `<td style="padding-right: 15px; vertical-align: middle; ${settings.imagePosition === 'right' ? 'padding-left: 15px; padding-right: 0;' : ''}">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="text-align: center; margin-bottom: 15px;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 18px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 10px; color: ${branding.secondaryColor || '#666'};">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 10px; color: #666;">
                ${personalInfo.email ? `<div>Email: <a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div>Phone: <a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                ${personalInfo.website ? `<div>Website: <a href="${sanitizeUrl(personalInfo.website)}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
                ${personalInfo.address ? `<div>${sanitize(personalInfo.address)}</div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 10px 0; color: #555; font-size: 13px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div>${ctaHTML}</div>
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 15px; vertical-align: middle;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'minimal':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 400px; color: #333333;">
          <tr>
            <td>
              <div style="border-left: 3px solid ${branding.primaryColor}; padding-left: 10px;">
                <div style="margin-bottom: 5px;">
                  <span style="font-weight: bold; font-size: 16px;">${sanitize(personalInfo.name)}</span>
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                  ${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}
                </div>
                <div style="font-size: 12px; margin-bottom: 8px;">
                  ${personalInfo.email ? `<span style="margin-right: 10px;"><a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></span>` : ''}
                  ${personalInfo.phone ? `<span><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></span>` : ''}
                </div>
                ${personalInfo.tagline ? `<div style="font-style: italic; margin: 6px 0; color: #555; font-size: 12px;">${sanitize(personalInfo.tagline)}</div>` : ''}
                <div style="margin-top: 10px;">${socialIconsHTML}</div>
                <div>${ctaHTML}</div>
              </div>
            </td>
          </tr>
        </table>
      `;
      break;
    case 'bold':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 550px; color: white; background-color: ${branding.primaryColor}; padding: 20px; border-radius: 10px;">
          <tr>
            ${settings.imagePosition === 'left' ? 
              `<td style="padding-right: 20px; vertical-align: middle; width: 80px;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="margin-bottom: 15px; text-align: center;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 22px;">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 15px; opacity: 0.9;">
                <span style="font-size: 16px;">${sanitize(personalInfo.title)}</span>
                ${personalInfo.company ? `<br><span style="font-size: 14px;">${sanitize(personalInfo.company)}</span>` : ''}
              </div>
              <div style="font-size: 13px; margin-bottom: 15px;">
                ${personalInfo.email ? `<div><a href="mailto:${personalInfo.email}" style="color: white; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: white; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 10px 0; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
              <div style="margin-top: 15px;">
                ${cta.text && cta.url ? `
                <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: white; color: ${branding.primaryColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-weight: bold;">
                  ${sanitize(cta.text)}
                </a>` : ''}
              </div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 20px; vertical-align: middle; width: 80px;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'hubspot':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #33475b; border: 1px solid #e5e7eb;">
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' && settings.imagePosition !== 'right' ? 
              `<td style="width: 30%; padding: 15px; vertical-align: middle; border-right: 1px solid #e5e7eb; text-align: center;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top; padding: 15px; ${settings.imagePosition === 'none' ? 'width: 100%;' : ''}">
              ${settings.imagePosition === 'top' ? `<div style="text-align: center; margin-bottom: 15px;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 16px; color: #ff7a59;">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 10px; color: #33475b;">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 10px;">
                ${personalInfo.email ? `<span style="margin-right: 10px;"><a href="mailto:${personalInfo.email}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.email)}</a></span>` : ''}
                ${personalInfo.phone ? `<span><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.phone)}</a></span>` : ''}
              </div>
              <div style="margin-top: 10px; display: flex; align-items: center;">
                <div>${ctaHTML.replace('background-color', 'background-color: #ff7a59;').replace('margin-top: 10px;', '')}</div>
                <div style="margin-left: 10px;">${socialIconsHTML}</div>
              </div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="width: 30%; padding: 15px; vertical-align: middle; border-left: 1px solid #e5e7eb; text-align: center;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'compact':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 400px; color: #333333;">
          <tr>
            <td>
              <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tr>
                    <td style="width: 50%;">
                      <span style="font-weight: bold; font-size: 14px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
                    </td>
                    <td style="width: 50%; text-align: right;">
                      ${cta.text && cta.url ? `
                      <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${cta.color}; color: white; padding: 4px 10px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-size: 12px;">
                        ${sanitize(cta.text)}
                      </a>` : ''}
                    </td>
                  </tr>
                </table>
              </div>
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td style="width: 70%; font-size: 12px;">
                    ${personalInfo.email ? `<div><a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                    ${personalInfo.phone ? `<div><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                  </td>
                  <td style="width: 30%; text-align: right;">
                    ${socialIconsHTML}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
      break;
    case 'standard':
    default:
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          ${logoHTML ? `<tr><td colspan="3" style="padding-bottom: 10px;">${logoHTML}</td></tr>` : ''}
          <tr>
            ${settings.imagePosition === 'left' ? 
              `<td style="padding-right: 15px; vertical-align: top; width: 80px;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="margin-bottom: 10px; text-align: center;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 16px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 5px; color: ${branding.secondaryColor || '#666'};">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}</span>
                ${personalInfo.company ? `<br><span style="font-size: 14px;">${sanitize(personalInfo.company)}</span>` : ''}
              </div>
              <div style="font-size: 12px; margin-bottom: 10px;">
                ${personalInfo.email ? `<div>Email: <a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div>Phone: <a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                ${personalInfo.website ? `<div>Website: <a href="${sanitizeUrl(personalInfo.website)}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
                ${personalInfo.address ? `<div>Address: ${sanitize(personalInfo.address)}</div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 8px 0; color: #555; font-size: 13px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div>${ctaHTML}</div>
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 15px; vertical-align: top; width: 80px;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
  }
  
  // Return the signature HTML directly without additional wrapper div
  // This prevents duplication when copying and pasting
  return templateHTML;
};

// Generate social media icons based on style - Email-safe version
const generateSocialIconsHTML = (
  socialLinks: Record<string, string | undefined>,
  style: string
): string => {
  if (!socialLinks || Object.keys(socialLinks).filter(key => socialLinks[key]).length === 0) {
    return '';
  }

  // Base64 encoded SVG icons to avoid external dependencies - Fixed icons with proper encoding
  const iconData: Record<string, { svg: string, color: string }> = {
    linkedin: {
      svg: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjAuNDQ3IDIwLjQ1MmgtMy41NTR2LTUuNTY5YzAtMS4zMjgtLjAyNy0zLjAzNy0xLjg1Mi0zLjAzNy0xLjg1MyAwLTIuMTM2IDEuNDQ1LTIuMTM2IDIuOTM5djUuNjY3SDkuMzUxVjloMy40MTR2MS41NjFoLjA0NmMuNDc3LS45IDEuNjM3LTEuODUgMy4zNy0xLjg1IDMuNjAxIDAgNC4yNjcgMi4zNyA0LjI2NyA1LjQ1NXY2LjI4NnpNNS4zMzcgNy40MzNjLTEuMTQ0IDAtMi4wNjMtLjkyNi0yLjA2My0yLjA2NSAwLTEuMTM4LjkyLTIuMDYzIDIuMDY1LTIuMDYzIDEuMTQgMCAyLjA2NC45MjUgMi4wNjQgMi4wNjMgMCAxLjEzOS0uOTI1IDIuMDY1LTIuMDY0IDIuMDY1em0xLjc4MiAxMy4wMTlIMy41NTVWOWgzLjU2NHYxMS40NTJ6TTIyLjIyNSAwSDEuNzcxQy43OTIgMCAwIC43NzQgMCAxLjcyOXYyMC41NDJDMCAyMy4yMjcuNzkyIDI0IDEuNzcxIDI0aDIwLjQ1MUMyMy4yIDI0IDI0IDIzLjIyNyAyNCAyMi4yNzFWMS43MjlDMjQgLjc3NCAyMy4yIDAgMjIuMjIyIDBoLjAwM3oiLz48L3N2Zz4=`,
      color: '#0077B5'
    },
    twitter: {
      svg: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjMuOTUzIDQuNTdhMTAgMTAgMCAwMS0yLjgyNS43NzUgNC45NTggNC45NTggMCAwMDIuMTYzLTIuNzIzYy0uOTUxLjU1NS0yLjAwNS45NTktMy4xMjcgMS4xODRhNC45MiA0LjkyIDAgMDAtOC4zODQgNC40ODJDNy42OSA4LjA5NSA0LjA2NyA2LjEzIDEuNjQgMy4xNjJhNC44MjIgNC44MjIgMCAwMC0uNjY2IDIuNDc1YzAgMS43MS44NyAzLjIxMyAyLjE4OCA0LjA5NmE0LjkwNCA0LjkwNCAwIDAxLTIuMjI4LS42MTZ2LjA2YTQuOTIzIDQuOTIzIDAgMDAzLjk0NiA0LjgyNyA0Ljk5NiA0Ljk5NiAwIDAxLTIuMjEyLjA4NSA0LjkzNiA0LjkzNiAwIDAwNC42MDQgMy40MTcgOS44NjcgOS44NjcgMCAwMS02LjEwMiAyLjEwNWMtLjM5IDAtLjc3OS0uMDIzLTEuMTctLjA2N2ExMy45OTUgMTMuOTk1IDAgMDA3LjU1NyAyLjIwOWM5LjA1MyAwIDEzLjk5OC03LjQ5NiAxMy45OTgtMTMuOTg1IDAtLjIxIDAtLjQyLS4wMTUtLjYzQTkuOTM1IDkuOTM1IDAgMDAyNCA0LjU5eiIvPjwvc3ZnPg==`,
      color: '#1DA1F2'
    },
    facebook: {
      svg: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMTIuMDczYzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyYzAgNS45OSA0LjM4OCAxMC45NTQgMTAuMTI1IDExLjg1NHYtOC4zODVINy4wNzh2LTMuNDdoMy4wNDdWOS40M2MwLTMuMDA3IDEuNzkyLTQuNjY5IDQuNTMzLTQuNjY5IDEuMzEyIDAgMi42ODYuMjM1IDIuNjg2LjIzNXYyLjk1M0gxNS44M2MtMS40OTEgMC0xLjk1Ni45MjUtMS45NTYgMS44NzR2Mi4yNWgzLjMyOGwtLjUzMiAzLjQ3aC0yLjc5NnY4LjM4NUMxOS42MTIgMjMuMDI3IDI0IDE4LjA2MiAyNCAxMi4wNzN6Ii8+PC9zdmc+`,
      color: '#1877F2'
    },
    instagram: {
      svg: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMEM4LjczNiAwIDguMzMyLjAxIDcuMDUyLjA2IDUuNzc1LjExIDQuOTA1LjI3OCA0LjE0LjUyNSAzLjM1Ljc4NCAyLjY4MiAxLjE1IDIuMDE0IDEuODIgMS4zNDcgMi40OS45OCAzLjE1OC43MjIgMy45NDcuNDcgNC43Mi4zMDMgNS41OS4yNTMgNi44Ni4yMDQgOC4xNS4yIDguNTQuMiAxMS44MTNzLjAwNCAzLjY2LjA1NSA0Ljk0OGMuMDUgMS4yOC4yMTggMi4xNDcuNDY1IDIuOTEzLjI2Ljg3LjYyIDEuNTM3IDEuMjk2IDIuMjE1LjY3Ni42NzYgMS4zMyAxLjA0IDEuOTk4IDEuMi43NTIuMjU1IDEuNi40MjYgMi45My40OCAxLjMyNS4wNCAxLjc1NC4wNSA0Ljk3NS4wNXMzLjY1NS0uMDEgNC45OC0uMDVjMS4zMjUtLjA1NSAyLjE4Ny0uMjI3IDIuOTMtLjQ4LjgwNS0uMjU3IDEuNDctLjYyIDIuMTI4LTEuMjg1LjY1Ni0uNjU3IDEuMDItMS4zMjYgMS4yOC0yLjEyNy4yNTMtLjc0NC40MjQtMS42MTQuNDgtMi45My4wNDYtMS4zMTMuMDQ2LTEuNzI2LjA0Ni00Ljk5NCAwLTMuMjY2LS4wMDgtMy42ODItLjA1Ni01LjAwNy0uMDU1LTEuMy0uMjM1LTIuMTYtLjQyNi0uMzU0LS45ODItLjUzLTEuNjY4LS41M0g4LjQ1MXYzLjI4MXpNMTYuMTEgMTUuMTloNi42MDZjLjAzMS0uNjk5LS4wMjQtMS4zNy0uMTY0LTIuMDE0YTQuMTA0IDQuMTA0IDAgMCAwLS42MjMtMS41NjJjLS4yOTYtLjQ1Mi0uNjktLjgxNi0xLjE4LTEuMDk1YTMuNTY1IDMuNTY1IDAgMCAwLTEuNjM5LS40MTljLS43NzUgMC0xLjQ1Ny4xNzgtMi4wNDkuNTM0YTMuOTQyIDMuOTQyIDAgMCAwLTEuMzc3IDEuNDIzYy0uMzI2LjU5Ni0uNDkgMS4yNDgtLjQ5IDEuOTYgMCAuNzQ0LjE2NCAxLjQwOC40OSAxLjk5M3MuNzc2IDEuMDQ5IDEuMzUgMS4zODZjLjU3NS4zMzggMS4xOTcuNTA2IDEuODY3LjUwNy45NzYgMCAxLjc5Mi0uMjU4IDIuNDQtLjc3My42NDgtLjUxNiAxLjA1NS0xLjIxMiAxLjIyMS0yLjA4OWgtMi4xNDhjLS4wODEuMzEtLjI1LjU2NS0uNTA4Ljc2YTEuNTYgMS41NiAwIDAxLS44OTUuMjU4Yy0uNTM2IDAtLjk1My0uMTgzLTEuMjUtLjU0OC0uMjk3LS4zNjYtLjQ2LS44NTQtLjQ5NS0xLjQ2Mmg1LjMxM3ptLS4zNjgtMS43NzhoLTQuMTE0Yy4wMi4zNC4xMjIuNjQzLjMwOS45MDkuMTg3LjI2Ni40MzQuNDc0Ljc0MS42MjYuMzA3LjE1Mi42Ni4yMjcgMS4wNi4yMjcuMzgyIDAgLjcxMy0uMDczLjk5Ny0uMjE4YTIuODggMi44OCAwIDAwLjY5Ny0uNTQzYy4xNjUtLjIwNi4yNzktLjQzOC4zNDUtLjY5NmwuMDQtLjEzMmwuMDI0LS4wODNjLjAxLS4wMy4wMTgtLjA2LjAyNC0uMDl6bS0uMDQtNC4zNDlIMjJ2MS42MmgtNC4zMDN2LTEuNjJ6IiBmaWxsPSIjMDA3MEJCII+PC9wYXRoPjwvc3ZnPg==`,
      color: '#E4405F'
    },
    github: {
      svg: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+`,
      color: '#181717'
    },
    behance: {
      svg: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNy44MDMgNS43N2g0LjAzNWMuNzc1IDAgMS41MDcuMTUzIDIuMTkzLjQ1N3MxLjI2NC43MjkgMS43MjkgMS4yNzJjLjQ2NS41NDQuNjk3IDEuMi42OTcgMS45NyAwIC43MjgtLjE3IDEuMzI3LS41MSAxLjc5OGEzLjYxOCAzLjYxOCAwIDAxLTEuMTE5IDEuMTAxYy42NzQuMjUxIDEuMTk0LjY0MyAxLjU2MiAxLjE3N3MuNTUxIDEuMTczLjU1MSAxLjkxMWMwIC43ODEtLjIgMS40NTUtLjYwMyAyLjAyM2EzLjkyIDMuOTIgMCAwMS0xLjYzMiAxLjMxNGMtLjY3OS4yOTgtMS40MzkuNDQ3LTIuMjgyLjQ0N0g3LjgwM1Y1Ljc3em0uNjQ4IDUuMTUyaDMuNTU1Yy42NjggMCAxLjIwOC0uMTcxIDEuNjE3LS41MTJzLjYxNi0uODIuNjE2LTEuNDM4YzAtLjYzMy0uMTk2LTEuMTE2LS41OC0xLjQ1My0uMzg2LS4zMzYtLjkxOS0uNTA0LTEuNTk4LS41MDRIOC40NXYzLjkwN3ptMCA1LjI1MWgzLjc3M2MuNzA0IDAgMS4yNy0uMTg0IDEuNjk1LS41NTIuNDI2LS4zNjguNjM5LS45MDUuNjM5LTEuNjEzIDAtLjY1Ny0uMjEyLTEuMTYzLS42MzktMS41MTYtLjQyNi0uMzU0LS45ODItLjUzLTEuNjY4LS41M0g4LjQ1MXYzLjI4MXpNMTYuMTEgMTUuMTloNi42MDZjLjAzMS0uNjk5LS4wMjQtMS4zNy0uMTY0LTIuMDE0YTQuMTA0IDQuMTA0IDAgMDAtLjYyMy0xLjU2MmMtLjI5Ni0uNDUyLS42OS0uODE2LTEuMTgtMS4wOTVhMy41NjUgMy41NjUgMCAwMC0xLjYzOS0uNDE5Yy0uNzc1IDAtMS40NTcuMTc4LTIuMDQ5LjUzNGEzLjk0MiAzLjk0MiAwIDAwLTEuMzc3IDEuNDIzYy0uMzI2LjU5Ni0uNDkgMS4yNDgtLjQ5IDEuOTYgMCAuNzQ0LjE2NCAxLjQwOC40OSAxLjk5M3MuNzc2IDEuMDQ5IDEuMzUgMS4zODZjLjU3NS4zMzggMS4xOTcuNTA2IDEuODY3LjUwNy45NzYgMCAxLjc5Mi0uMjU4IDIuNDQtLjc3My42NDgtLjUxNiAxLjA1NS0xLjIxMiAxLjIyMS0yLjA4OWgtMi4xNDhjLS4wODEuMzEtLjI1LjU2NS0uNTA4Ljc2YTEuNTYgMS41NiAwIDAxLS44OTUuMjU4Yy0uNTM2IDAtLjk1My0uMTgzLTEuMjUtLjU0OC0uMjk3LS4zNjYtLjQ2LS44NTQtLjQ5NS0xLjQ2Mmg1LjMxM3ptLS4zNjgtMS43NzhoLTQuMTE0Yy4wMi4zNC4xMjIuNjQzLjMwOS45MDkuMTg3LjI2Ni40MzQuNDc0Ljc0MS42MjYuMzA3LjE1Mi42Ni4yMjcgMS4wNi4yMjcuMzgyIDAgLjcxMy0uMDczLjk5Ny0uMjE4YTIuODggMi44OCAwIDAwLjY5Ny0uNTQzYy4xNjUtLjIwNi4yNzktLjQzOC4zNDUtLjY5NmwuMDQtLjEzMmwuMDI0LS4wODNjLjAxLS4wMy4wMTgtLjA2LjAyNC0uMDl6bS0uMDQtNC4zNDlIMjJ2MS42MmgtNC4zMDN2LTEuNjJ6IiBmaWxsPSIjMDA3MEJCIj48L3BhdGg+PC9zdmc+`,
      color: '#0070BB'
    }
  };

  const iconSize = 20;
  const iconSpacing = 8;

  // Create HTML for social icons based on style
  let icons = '';
  
  Object.entries(socialLinks).forEach(([platform, url]) => {
    if (!url) return; // Skip if no URL provided
    
    const iconInfo = iconData[platform as keyof typeof iconData];
    if (!iconInfo) return; // Skip if platform not found in iconData
    
    const sanitizedUrl = sanitizeUrl(url);
    const iconColor = style === 'color' ? iconInfo.color : style === 'monochrome' ? '#555555' : 'white';
    const bgColor = (style === 'circle' || style === 'square') ? iconInfo.color : 'transparent';
    const borderRadius = style === 'circle' ? '50%' : style === 'square' ? '4px' : '0';
    const padding = (style === 'circle' || style === 'square') ? '6px' : '0';
    
    icons += `
      <a href="${sanitizedUrl}" style="display: inline-block; margin-right: ${iconSpacing}px; text-decoration: none;" target="_blank" rel="noopener noreferrer">
        <div style="background-color: ${bgColor}; border-radius: ${borderRadius}; padding: ${padding}; display: flex; align-items: center; justify-content: center; width: ${iconSize}px; height: ${iconSize}px;">
          <img src="data:image/svg+xml;base64,${iconInfo.svg}" alt="${platform}" style="width: ${style === 'circle' || style === 'square' ? '16px' : iconSize + 'px'}; height: ${style === 'circle' || style === 'square' ? '16px' : iconSize + 'px'}; ${style !== 'color' && style !== 'monochrome' ? '' : `filter: ${iconColor === '#555555' ? 'grayscale(100%)' : ''};`}">
        </div>
      </a>
    `;
  });

  return icons;
};
