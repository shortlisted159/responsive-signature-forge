
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
  
  // Company logo - ensure it's properly formatted for email clients
  const logoHTML = logoUrl ? `
    <div style="margin-bottom: 10px;">
      <img src="${logoUrl}" alt="${sanitize(personalInfo.company)} logo" style="display: block; max-height: 60px; max-width: 180px; height: auto; width: auto;" border="0">
    </div>
  ` : '';
  
  // Profile photo
  const photoHTML = personalInfo.photoUrl ? 
    `<img src="${personalInfo.photoUrl}" alt="${sanitize(personalInfo.name)}" style="display: block; border-radius: 50%; width: 80px; height: 80px; object-fit: cover; ${settings.imagePosition === 'none' ? 'display: none;' : ''}" border="0">` : '';
  
  // CTA button
  const ctaHTML = cta.text && cta.url ? `
    <div style="margin-top: 10px;">
      <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${buttonColor}; color: ${ctaTextColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: ${fontFamily}; border: none;">
        ${sanitize(cta.text)}
      </a>
    </div>
  ` : '';

  // Different layouts based on settings
  let templateHTML = '';
  
  switch (settings.layout) {
    case 'modern':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          ${logoHTML ? `<tr><td style="padding-bottom: 15px;" colspan="2">${logoHTML}</td></tr>` : ''}
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' && settings.imagePosition !== 'right' ? 
              `<td style="padding-right: 15px; vertical-align: middle;">
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
              ${ctaHTML}
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
                ${ctaHTML}
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
                <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: white; color: ${branding.primaryColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-weight: bold; border: none;">
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
                <div>${ctaHTML.replace('margin-top: 10px;', '')}</div>
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
                      ${ctaHTML.replace('margin-top: 10px;', '')}
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
              ${ctaHTML}
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
  
  return templateHTML;
};

// Generate social media icons based on style - Email-safe version with proper SVG data
const generateSocialIconsHTML = (
  socialLinks: Record<string, string | undefined>,
  style: string
): string => {
  if (!socialLinks || Object.keys(socialLinks).filter(key => socialLinks[key]).length === 0) {
    return '';
  }

  // Properly encoded SVG icons for email compatibility
  const iconData: Record<string, { svg: string, color: string }> = {
    linkedin: {
      svg: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDA3N0I1Ij48cGF0aCBkPSJNMjAuNDQ3IDIwLjQ1MmgtMy41NTR2LTUuNTY5YzAtMS4zMjgtLjAyNy0zLjAzNy0xLjg1Mi0zLjAzNy0xLjg1MyAwLTIuMTM2IDEuNDQ1LTIuMTM2IDIuOTM5djUuNjY3SDkuMzUxVjloMy40MTR2MS41NjFoLjA0NmMuNDc3LS45IDEuNjM3LTEuODUgMy4zNy0xLjg1IDMuNjAxIDAgNC4yNjcgMi4zNyA0LjI2NyA1LjQ1NXY2LjI4NnpNNS4zMzcgNy40MzNjLTEuMTQ0IDAtMi4wNjMtLjkyNi0yLjA2My0yLjA2NSAwLTEuMTM4LjkyLTIuMDYzIDIuMDY1LTIuMDYzIDEuMTQgMCAyLjA2NC45MjUgMi4wNjQgMi4wNjMgMCAxLjEzOS0uOTI1IDIuMDY1LTIuMDY0IDIuMDY1em0xLjc4MiAxMy4wMTlIMy41NTVWOWgzLjU2NHYxMS40NTJ6TTIyLjIyNSAwSDEuNzcxQy43OTIgMCAwIC43NzQgMCAxLjcyOXYyMC41NDJDMCAyMy4yMjcuNzkyIDI0IDEuNzcxIDI0aDIwLjQ1MUMyMy4yIDI0IDI0IDIzLjIyNyAyNCAyMi4yNzFWMS43MjlDMjQgLjc3NCAyMy4yIDAgMjIuMjIyIDBoLjAwM3oiLz48L3N2Zz4=`,
      color: '#0077B5'
    },
    twitter: {
      svg: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMURBMUYyIj48cGF0aCBkPSJNMjMuOTUzIDQuNTdhMTAgMTAgMCAwMS0yLjgyNS43NzUgNC45NTggNC45NTggMCAwMDIuMTYzLTIuNzIzYy0uOTUxLjU1NS0yLjAwNS45NTktMy4xMjcgMS4xODRhNC45MiA0LjkyIDAgMDAtOC4zODQgNC40ODJDNy42OSA4LjA5NSA0LjA2NyA2LjEzIDEuNjQgMy4xNjJhNC44MjIgNC44MjIgMCAwMC0uNjY2IDIuNDc1YzAgMS43MS44NyAzLjIxMyAyLjE4OCA0LjA5NmE0LjkwNCA0LjkwNCAwIDAxLTIuMjI4LS42MTZ2LjA2YTQuOTIzIDQuOTIzIDAgMDAzLjk0NiA0LjgyNyA0Ljk5NiA0Ljk5NiAwIDAxLTIuMjEyLjA4NSA0LjkzNiA0LjkzNiAwIDAwNC42MDQgMy40MTcgOS44NjcgOS44NjcgMCAwMS02LjEwMiAyLjEwNWMtLjM5IDAtLjc3OS0uMDIzLTEuMTctLjA2N2ExMy45OTUgMTMuOTk1IDAgMDA3LjU1NyAyLjIwOWM5LjA1MyAwIDEzLjk5OC03LjQ5NiAxMy45OTgtMTMuOTg1IDAtLjIxIDAtLjQyLS4wMTUtLjYzQTkuOTM1IDkuOTM1IDAgMDAyNCA0LjU5eiIvPjwvc3ZnPg==`,
      color: '#1DA1F2'
    },
    facebook: {
      svg: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMTg3N0YyIj48cGF0aCBkPSJNMjQgMTIuMDczYzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyYzAgNS45OSA0LjM4OCAxMC45NTQgMTAuMTI1IDExLjg1NHYtOC4zODVINy4wNzh2LTMuNDdoMy4wNDdWOS40M2MwLTMuMDA3IDEuNzkyLTQuNjY5IDQuNTMzLTQuNjY5IDEuMzEyIDAgMi42ODYuMjM1IDIuNjg2LjIzNXYyLjk1M0gxNS44M2MtMS40OTEgMC0xLjk1Ni45MjUtMS45NTYgMS44NzR2Mi4yNWgzLjMyOGwtLjUzMiAzLjQ3aC0yLjc5NnY4LjM4NUMxOS42MTIgMjMuMDI3IDI0IDE4LjA2MiAyNCAxMi4wNzN6Ii8+PC9zdmc+`,
      color: '#1877F2'
    },
    instagram: {
      svg: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRTQ0MDVGIj48cGF0aCBkPSJNMTIuMDE3IDBoNC43NjhjMS42OC4wMjcgMi45OTcuMDcxIDMuOTM2IDIuMTY4LjE0My4zMjMuMjQ0LjY5My4yNDQgMS4wOTlWMjEuNzMzYzAgLjQyNi0uMTAzLjc4OC0uMjQ0IDEuMDk5LS4zOTEuODU3LS44MDggMS41NDctMS40MDMgMi4xNDItLjU5My41OTMtMS4yODYgMS4wMDktMi4xNDIgMS40MDMtLjMxMS4xNDEtLjY3My4yNDQtMS4wOTkuMjQ0SDIuMjY3Yy0uNDI2IDAtLjc4Ny0uMTAzLTEuMDk5LS4yNDQtLjg1Ny0uMzk0LTEuNTQ5LS44MS0yLjE0Mi0xLjQwM0MtLjM2NyAyMy4wMjEtLjc4MiAyMi4zMjktMS4xNzYgMjEuNDcyYy0uMTQxLS4zMTEtLjI0NC0uNjczLS4yNDQtMS4wOTlWMi4yNjdjMC0uNDA2LjEwMy0uNzc2LjI0NC0xLjA5OS40MjktMS45NjMgMS44ODctMi4xNDEgMy45MzYtMi4xNjhoNC43NjhMMTIuMDE3IDB6bTMuNzQ4IDcuNDdhMS45IDEuOSAwIDAwLTEuOSAxLjlWMTJhMS45IDEuOSAwIDAwMS45IDEuOWgyLjU5YTEuOSAxLjkgMCAwMDEuOS0xLjlWOS4zN2ExLjkgMS45IDAgMDAtMS45LTEuOWgtMi41OXptLTcuNSAxLjAzdjguOTk2QzguMjY1IDIwLjk5NyAxMC43MTggMjEgMTIgMjFoMC4wNDJjNC4yNiAwIDcuMDI2LTIuNzY2IDcuMDI2LTcuMDI2VjEwLjA0MmMwLTQuMjYtMi43NjYtNy4wMjYtNy4wMjYtNy4wMjZIOVptMCAwSDYuNDg3Yy00LjI2IDAtNy4wMjYgMi43NjYtNy4wMjYgNy4wMjZ2My45NThjMCA0LjI2IDIuNzY2IDcuMDI2IDcuMDI2IDcuMDI2SDEyeiIvPjwvc3ZnPg==`,
      color: '#E4405F'
    },
    github: {
      svg: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMTgxNzE3Ij48cGF0aCBkPSJNMTIgMEM1LjM3NCAwIDAgNS4zNzMgMCAxMiAwIDE3LjMwMiAzLjQzOCAyMS44IDguMjA3IDIzLjM4N2MuNTk5LjExMi44MTktLjI2MS44MTktLjU3NyAwLS4yODUtLjAxLTEuMDQtLjAxNS0yLjA0LTMuMzM4LjcyNC00LjA0Mi0xLjYxLTQuMDQyLTEuNjFDNC40MjIgMTguMDcgMy42MzMgMTcuNyAzLjYzMyAxNy43Yy0xLjA4Ny0uNzQ0LjA4NC0uNzI5LjA4NC0uNzI5IDEuMjA1LjA4NCAxLjgzOCAxLjIzNiAxLjgzOCAxLjIzNiAxLjA3IDEuODM1IDIuODA5IDEuMzA1IDMuNDk1Ljk5OC4xMDgtLjc3Ni40MTctMS4zMDUuNzYtMS42MDUtMi42NjUtLjMtNS40NjYtMS4zMzItNS40NjYtNS45MyAwLTEuMzEuNDY1LTIuMzggMS4yMzUtMy4yMi0uMTM1LS4zMDMtLjU0LTEuNTIzLjEwNS0zLjE3NiAwIDAgMS4wMDUtLjMyMiAzLjMgMS4yMy45Ni0uMjY3IDEuOTgtLjM5OSAzLS40MDUgMS4wMi4wMDYgMi4wNC4xMzggMyAuNDA1IDIuMjgtMS41NTIgMy4yODUtMS4yMyAzLjI4NS0xLjIzLjY0NSAxLjY1My4yNCAyLjg3My4xMiAzLjE3Ni43NjUuODQgMS4yMyAxLjkxIDEuMjMgMy4yMiAwIDQuNjEtMi44MDUgNS42MjUtNS40NzUgNS45Mi40MjUuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMS4wOTIgMjQgMTYuNTkyIDI0IDEyIDI0IDUuMzczIDE4LjYyNyAwIDEyIDB6Ii8+PC9zdmc+`,
      color: '#181717'
    },
    behance: {
      svg: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDA3MEJCIJ+PGcgZmlsbD0iIjAwNzBCQiI+PHBhdGggZD0iTTAgNi43djEwLjZoNy4zYzEuNCAwIDIuNy0uMyAzLjgtLjkgMS4xLS42IDEuOS0xLjUgMi4zLTIuNi40LS45LjYtMS45LjYtM2MwLS43LS4yLTEuNC0uNS0yLS4zLS42LS44LTEuMS0xLjQtMS41LjUtLjQgMS0xIDEuMy0xLjcuMy0uNy41LTEuNS41LTIuNGMwLTEuMS0uMy0yLjEtMS0yLjktLjctLjgtMS43LTEuMy0yLjktMS40LTEuNy0uMi0zLjUtLjEtNS4zLS4xSDBoLS4wczAtMCAwIDZ2ek00IDloOWMuNyAwIDEuMy4yIDEuNy43LjQuNC43IDEgLjcgMS43cy0uMyAxLjMtLjcgMS43Yy0uNC40LTEgLjctMS43LjdINHYtMS4xem0wIDQuOGgxMC4zYy44IDAgMS41LjMgMiAuOC41LjYuNyAxLjMuNyAyLjFzLS4yIDEuNS0uNyAyLjFjLS41LjUtMS4yLjgtMiAuOEg0VjEzLjh6bTE0LjEtNi43aDUuOXYxLjZIMTguMVY3LjF6bS0uMSA0LjloNy4yYy4wMiAxLjEtLjEgMi4yLS40IDMuMi0uMyAxLjEtLjggMi4wMS0xLjUgMi44LS43Ljc4LTEuNSAxLjM5LTIuNCAxLjgxLTEgLjQzLTIuMDguNjItMy4xOC42Mi0xLjAzIDAtMi4wMi0uMTctMi45NS0uNTJhNy44NSA3Ljg1IDAgMDEtMi41Mi0xLjQ3Yy0uNzItLjY0LTEuMjktMS40MS0xLjctMi4zNC0uNDItLjkzLS42My0xLjk2LS42My0zLjA4czAuMjEtMi4xNS42My0zLjA4Yy4wNC0uMjAuNjY2LTEuNyAxLjctMi4zNGE3LjA1IDcuMDUgMCAwMTIuNTItMS40N2M0LjI4LTEuODIgOC44OCAwIDEwIDQuNDNIMThsLS4wNS0uMDNjLS4yOC0uODUtLjc2LTEuNTgtMS40My0yLjE5YTQuMTggNC4xOCAwIDAwLTIuNDEtLjc5Yy0uOTUgMC0xLjgxLjMzLTIuNTYgMS4wYTMuNSAzLjUgMCAwMC0xLjMzIDIuODRoLTYuNDl6Ii8+PC9nPjwvc3ZnPg==`,
      color: '#0070BB'
    }
  };

  const iconSize = 20;
  const iconSpacing = 8;

  let icons = '';
  
  Object.entries(socialLinks).forEach(([platform, url]) => {
    if (!url) return;
    
    const iconInfo = iconData[platform as keyof typeof iconData];
    if (!iconInfo) return;
    
    const sanitizedUrl = sanitizeUrl(url);
    const bgColor = (style === 'circle' || style === 'square') ? iconInfo.color : 'transparent';
    const borderRadius = style === 'circle' ? '50%' : style === 'square' ? '4px' : '0';
    const padding = (style === 'circle' || style === 'square') ? '6px' : '0';
    
    icons += `
      <a href="${sanitizedUrl}" style="display: inline-block; margin-right: ${iconSpacing}px; text-decoration: none;" target="_blank" rel="noopener noreferrer">
        <div style="background-color: ${bgColor}; border-radius: ${borderRadius}; padding: ${padding}; display: inline-block; width: ${iconSize}px; height: ${iconSize}px; text-align: center; line-height: ${iconSize}px;">
          <img src="${iconInfo.svg}" alt="${platform}" style="width: ${style === 'circle' || style === 'square' ? '16px' : iconSize + 'px'}; height: ${style === 'circle' || style === 'square' ? '16px' : iconSize + 'px'}; vertical-align: middle; border: none; display: inline-block;">
        </div>
      </a>
    `;
  });

  return icons;
};
