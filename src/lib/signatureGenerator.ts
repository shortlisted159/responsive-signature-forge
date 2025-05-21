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
                ${personalInfo.website ? `<div><a href="${sanitizeUrl(personalInfo.website)}" style="color: white; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
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
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      ${templateHTML}
    </div>
  `;
};

// Generate social media icons based on style - Email-safe version
const generateSocialIconsHTML = (
  socialLinks: Record<string, string | undefined>,
  style: string
): string => {
  if (!socialLinks || Object.keys(socialLinks).filter(key => socialLinks[key]).length === 0) {
    return '';
  }

  // Base64 encoded SVG icons to avoid external dependencies
  const iconData: Record<string, { svg: string, color: string }> = {
    linkedin: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TGlua2VkSW48L3RpdGxlPjxwYXRoIGQ9Ik0yMC40NDcgMjAuNDUyaC0zLjU1NHYtNS41NjljMC0xLjMyOC0uMDI3LTMuMDM3LTEuODUyLTMuMDM3LTEuODUzIDAtMi4xMzYgMS40NDUtMi4xMzYgMi45Mzl2NS42NjdIOS4zNTFWOWgzLjQxNHYxLjU2MWguMDQ2Yy40NzctLjkgMS42MzctMS44NSAzLjM3LTEuODUgMy42MDEgMCA0LjI2NyAyLjM3IDQuMjY3IDUuNDU1djYuMjg2ek01LjMzNyA3LjQzM2MtMS4xNDQgMC0yLjA2My0uOTI2LTIuMDYzLTIuMDY1IDAtMS4xMzguOTItMi4wNjMgMi4wNjUtMi4wNjMgMS4xNCAwIDIuMDY0LjkyNSAyLjA2NCAyLjA2MyAwIDEuMTM5LS45MjUgMi4wNjUtMi4wNjQgMi4wNjV6bTEuNzgyIDEzLjAxOUgzLjU1NVY5aDMuNTY0djExLjQ1MnpNMjIuMjI1IDBIMS43NzFDLjc5MiAwIDAgLjc3NCAwIDEuNzI5djIwLjU0MkMwIDIzLjIyNy43OTIgMjQgMS43NzEgMjRoMjAuNDUxQzIzLjIgMjQgMjQgMjMuMjI3IDI0IDIyLjI3MVYxLjcyOUMyNCAuNzc0IDIzLjIgMCAyMi4yMjIgMGguMDAzeiIvPjwvc3ZnPg==`,
      color: '#0077B5'
    },
    twitter: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+VHdpdHRlcjwvdGl0bGU+PHBhdGggZD0iTTIzLjk1MyA0LjU3YTEwIDEwIDAgMDEtMi44MjUuNzc1IDQuOTU4IDQuOTU4IDAgMDAyLjE2My0yLjcyM2MtLjk1MS41NTUtMi4wMDUuOTU5LTMuMTI3IDEuMTg0YTQuOTIgNC45MiAwIDAwLTguMzg0IDQuNDgyQzcuNjkgOC4wOTUgNC4wNjcgNi4xMyAxLjY0IDMuMTYyYTQuODIyIDQuODIyIDAgMDAtLjY2NiAyLjQ3NWMwIDEuNzEuODcgMy4yMTMgMi4xODggNC4wOTZhNC45MDQgNC45MDQgMCAwMS0yLjIyOC0uNjE2di4wNmE0LjkyMyA0LjkyMyAwIDAwMy45NDYgNC44MjcgNC45OTYgNC45OTYgMCAwMS0yLjIxMi4wODUgNC45MzYgNC45MzYgMCAwMDQuNjA0IDMuNDE3IDkuODY3IDkuODY3IDAgMDEtNi4xMDIgMi4xMDVjLS4zOSAwLS43NzktLjAyMy0xLjE3LS4wNjdhMTMuOTk1IDEzLjk5NSAwIDAwNy41NTcgMi4yMDljOS4wNTMgMCAxMy45OTgtNy40OTYgMTMuOTk4LTEzLjk4NSAwLS4yMSAwLS40Mi0uMDE1LS42M0E5LjkzNSA5LjkzNSAwIDAwMjQgNC41OXoiLz48L3N2Zz4=`,
      color: '#1DA1F2'
    },
    facebook: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+RmFjZWJvb2s8L3RpdGxlPjxwYXRoIGQ9Ik0yNCAxMi4wNzNjMC02LjYyNy01LjM3My0xMi0xMi0xMnMtMTIgNS4zNzMtMTIgMTJjMCA1Ljk5IDQuMzg4IDEwLjk1NCAxMC4xMjUgMTEuODU0di04LjM4NUg3LjA3OHYtMy40N2gzLjA0N1Y5LjQzYzAtMy4wMDcgMS43OTItNC42NjkgNC41MzMtNC42NjkgMS4zMTIgMCAyLjY4Ni4yMzUgMi42ODYuMjM1djIuOTUzSDE1LjgzYy0xLjQ5MSAwLTEuOTU2LjkyNS0xLjk1NiAxLjg3NHYyLjI1aDMuMzI4bC0uNTMyIDMuNDdoLTIuNzk2djguMzg1QzE5LjYxMiAyMy4wMjcgMjQgMTguMDYyIDI0IDEyLjA3M3oiLz48L3N2Zz4=`,
      color: '#1877F2'
    },
    instagram: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+SW5zdGFncmFtPC90aXRsZT48cGF0aCBkPSJNMTIgMEM4LjczNiAwIDguMzMyLjAxIDcuMDUyLjA2IDUuNzc1LjExIDQuOTA1LjI3OCA0LjE0LjUyNSAzLjM1Ljc4NCAyLjY4MiAxLjE1IDIuMDE0IDEuODJjLS42NjguNjctMS4wMzYgMS4zMzYtMS4yOTIgMi4xMjYtLjI1Ljc2LS40MTIgMS42MzItLjQ2IDIuOTFDLjAxIDcuMSAwIDcuNTAzIDAgMTAuNzY3YzAgMy4yNjQuMDEgMy42NjcuMDYgNC45NDYuMDUgMS4yNzguMjE4IDIuMTQ4LjQ2IDIuOTEuMjUuNzg2LjYyNSAxLjQ1NSAxLjI5MiAyLjEyMi42NjguNjcgMS4zMzYgMS4wMzYgMi4xMjYgMS4yOTIuNzYuMjUgMS42MzIuNDE1IDIuOTEuNDYgMS4zLjA1IDEuNjkyLjA2IDQuOTU3LjA2IDMuMjY0IDAgMy42NjctLjAxIDQuOTQ2LS4wNiAxLjI3OC0uMDQ1IDIuMTQ4LS4yMSAyLjkxLS40Ni43ODUtLjI1Ny0uNzg1LS42MjMtMS40NTQtMS4yOTIuNjctLjY2NiAxLjAzNy0xLjMzNSAxLjI5NC0yLjEyNi4yNS0uNzYuNDEzLTEuNjMtLjQxNS0yLjkxLS40Ni1xLjI3OC0uMDQ1LTEuNjg5LS4wNi00Ljk1My0uMDZ6bTAgMi4xNmMzLjIwMyAwIDMuNTg1LjAxIDQuODUuMDU3IDEuMTcuMDUzIDEuODA1LjI0OSAyLjIyNy40MTUuNTYyLjIxNy45Ni40NzcgMS4zODIuODk2LjQxOS40Mi42NzkuODE5Ljg5NiAxLjM4MS4xNjQuNDIyLjM2IDEuMDU3LjQxMyAyLjIyNy4wNDggMS4yNjguMDU4IDEuNjUuMDU4IDQuODV2LjAwN2MwIDMuMTk4LS4wMSAzLjU4LS4wNTggNC44NDUtLjA1NCAxLjE3LS4yNSAxLjgwNS0uNDE0IDIuMjI3LS4yMTcuNTYyLS40OC45Ni0uODk2IDEuMzgyLS40Mi40MTktLjgyLjY3OS0xLjM4Mi44OTYtLjQyMi4xNjQtMS4wNTguMzYtMi4yMjYuNDEzLTEuMjcuMDQ4LTEuNjUuMDU4LTQuODU2LjA1OC0zLjIwNSAwLTMuNTg2LS4wMS00Ljg1My0uMDU4LTEuMTctLjA1My0xLjgwNS0uMjQ5LTIuMjI3LS40MTMtLjU2NS0uMjE3LS45NjMtLjQ4LTEuMzgxLS44OTYtLjQyLS40Mi0uNjgtLjgyLS44OTYtMS4zODEtLjE2NC0uNDIyLS4zNi0xLjA1OC0uNDEzLTIuMjI3LS4wNDktMS4yNy0uMDU5LTEuNjUtLjA1OS00Ljg1IDAtMy4yMDMuMDEtMy41ODIuMDU5LTQuODUuMDU0LTEuMTcuMjUtMS44MDQuNDEzLTIuMjI3LjIxNi0uNTYyLjQ3Ni0uOTYyLjg5Ni0xLjM4MS40Mi0uNDIuODItLjY3OSAxLjM4My0uODk2LjQyLS4xNjQgMS4wNTYtLjM2IDIuMjI1LS40MTNDOC40MTUgMi4xNiA4Ljc5NiAyLjE1NSAxMiAyLjE1NXptMCAzLjY2M0E1LjE4IDUuMTggMCAwMDYuODIzIDEyYTUuMTggNS4xOCAwIDAwNS4xNzcgNS4xNzcgNS4xOCA1LjE4IDAgMDA1LjE3OC01LjE3N0E1LjE4IDUuMTggMCAwMDEyIDUuODE3em0wIDguNTRhMy4zNiAzLjM2IDAgMTEwLTYuNzIgMy4zNiAzLjM2IDAgMTEwIDYuNzJ6bTYuNi04Ljk4YTEuMiAxLjIgMCAxMS0yLjQwNy0uMDAyIDEuMiAxLjIgMCAwMTIuNDA1LjAwMnoiLz48L3N2Zz4=`,
      color: '#E4405F'
    },
    github: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViPC90aXRsZT48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+`,
      color: '#181717'
    },
    behance: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+QmVoYW5jZTwvdGl0bGU+PHBhdGggZD0iTTcuNDQzIDUuMzQ1YzEuMTYyIDAgMi4wNDQtLjEzMSAyLjY0NC0uNDExLjU5Ny0uMjY2IDEuMDc5LS42OSAxLjQ0LTEuMjgzLjM2LS41NzIuNTQzLTEuMjgyLjU0My0yLjEzOCAwLS43NjMtLjE2LTEuNDE0LS40ODMtMS45MzRhMi41MSAyLjUxIDAgMC0uMDktMS4yMTFoMy41MzRjMS4yOTQgMCAyLjQ0NS0uMTE2IDMuNDQxLS4zNjIuOTkzLS4yNDQgMS44MzItLjYyMyAyLjUxMS0xLjE0OGExOS4yNCAxOS4yNCAwIDAwMS44MjctMS42OGMyLjc0NSAyLjM5MiA2LjUxNiA0LjU2NCAxMC40MDQgMS42NjUtMS44OTcgNC44NzUtMi44Ni03LjUxIDBhMTAuOTEgMTAuOTEgMCAwMC0uNzk4LTIuNjIyYy0uMzQyLS44MjctLjgtMS41NTMtMS4zNzItMi4xODUtLjU3LS42MzEtMS4yNTItMS4xODQtMi4wMy0xLjY2LTEuNDM0LS44Ny0zLjAxLTEuNC00LjcyOS0xLjU4N2wyLjA0LTkuOTcxSDcuNDQ0em0tLjg0NiAxLjA0OUgzLjQ5djQuNzU4aDIuOTM5YzEuMDM0IDAgMS44NzYtLjE0NSAyLjUyNy0uNDUuNjUtLjMwMSAxLjE0My0uODEzIDEuMzE5LTEuNDgyLjE3LS42NTMuMTU2LTEuNDE2LS4wNS0xLjk4Ny0uMjE1LS42MDUtLjc0NC0xLjA2NC0xLjM5Ni0xLjIyNC0xLjAyMy0uMjQ3LTIuMDItLjEzLTMuMjIzLS4xM3YxLjA0OWMwLS4wMzQtMS4wMzQtLjA3NS0xLjA5Ni0uMDUyLS4wNjQuMDIzLS4xMDYuMDU5LS4xMjcuMTA2LS4wMjIuMDQ1LS4wMzIuMDg3LS4wMzIuMTNhLjcxLjcxIDAgMDAuMDMyLjEzMS42OS42OSAwIDAwLjA4Ni4xMDZjLjA0NC4wMzMuMDk1LjA1Mi4xNDcuMDUybDEuMDkuMDUzdjIuNTAzbC0xLjE2OS0yLjU4M2EuNDQzLjQ0MyAwIDAwLS4wNjYtLjA5OC4zNjUuMzY1IDAgMDAtLjA5Ni0uMDY2LjMxLjMxIDAgMDAtLjExLS4wMjguMzQyLjM0MiAwIDAwLS4xNTcuMDguMzkyLjM5MiAwIDAwLS4xMDYuMTEzek01LjM5NCA1LjkzOWMuMzc0IDAgLjcxMS4wMDQgMS4wMi4wMTIuMzE0LjAwOC41NzUuMDIuNzkzLjAzOS4yMy4wMi40Mi4wNDYuNTc3LjA3OS4zNDYuMDc0LjYyMi4yOTcuODI3LjY3LjE5OS4zNTkuMjk1Ljc5LjI5NSAxLjI5OSAwIC4zNDMtLjA1LjY2MS0uMTQ5Ljk0MmExLjQ2IDEuNDYgMCAwMS0uNDIuNjYzYy0uMTc5LjE2OS0uNCjMxLjMtLjY2Ny40Mi0uMjU3LjExMi0uNTY1LjE5NS0uOTIzLjI0NGEzOC43OSAzOC43OSAwIDAxLTEuMzUzLjEzOXptLS43MDUgNS4yMmMuODI4IDAgMS41NzUuMDQ0IDIuMjMzLjEyOS42NTcuMDkgMS4yMi4yNDUgMS42OS40OTEuNDY4LjI1Mi44MjkuNi4xLjA5NmEyLjE4IDIuMTggMCAwMS41OTQuOTg4Yy4xMzYuNDA5LjIwNi44OTkuMjA2IDEuNDY5IDAgLjc2NS0uMTQ1IDEuNDIyLS40MzkgMS45NTZhMi41NjMgMi41NjMgMCAwMS0xLjI0IDEuMDZjLS41MjkuMjI2LTEuNDY1LjMxLTIuMTI4LjMxSDMuNDl2LTYuNDk5em0uMTk4IDEuNDU2SDQuOTk1djMuNThoLjA1NWMuNDc0IDAgLjk0Mi0uMDEgMS4zOTgtLjA0Mi40NTktLjAzLjg3Ni0uMDk4IDEuMjQ1LS4yMDUuMzc0LS4xMDcuNjctLjI4Ljg5Mi0uNTI2LjIyLS4yNDIuMzMtLjU5LjMzLTEuMDQzIDAtLjM1LS4wNzktLjY0NS0uMjM1LS44ODQtLjE1OS0uMjM5LS4zOTItLjQyLS43MDQtLjU0NC0uMzEzLS4xMjUtLjcwNS0uMjA1LTEuMTk0LS4yNDUtLjQ4OS0uMDQtMS4wMzUtLjA2Mi0xLjY0LS4wNjJ2LjAzem02LjE2OS01LjgzOGg3LjM0NlY4LjA3NmgtNy4zNDZ6bS42OTMgMS42MTdjMS4zODYgMCAyLjQ4OS4zOTcgMy4zMDYgMS4xOTIuODE3Ljc5NiAxLjIyNiAxLjgxIDEuMjI2IDMuMDQzIDAgLjg2MS0uMTgxIDEuNTgxLS41NDQgMi4xNWExLjUyIDEuNTIgMCAwMS0xLjMzNC43MjZjLjQ1OS4yMDQuNzkzLjUzNiAxLjAwOCAxIC4yMTIuNDYyLjMxOCAxLjAwMy4zMTggMS42NDVhNy45NzMgNy45NzMgMCAwMS0uMTM4IDEuNWMtLjA5NC41LS4yMzIuOTUzLS40MjEgMS4zNDQtLjE4OC4zOTItLjQxOS43MjktLjY5MiAxLS4zNDQuMzQtLjczLjU5LTEuMTU1Ljc0LS40MjYuMTUyLS44ODguMjUtMS4zOC4zLTQuODIyLjQ4Ny01LjQzOC4yOTYtNy4xMzQtLjQ4M2EyLjI1IDIuMjUgMCAwMS0uNzgyLTEuNjY0Yy0uMDM0LS4yNDgtLjA1MS0uNjItLjA1MS0xLjExMS4wMDEtLjQwNS0uMDEzLS43MS0uMDQtLjkyNC0uMDIyLS4yMS0uMDYyLS40MjItLjExOS0uNjQzLS4wNTgtLjIxNy0uMTQzLS40MS0uMjYtLjU4Ny0uMTE1LS4xNzMtLjI3NC0uMzE1LS40ODEtLjQzMnYtLjAyNmMuNDY4LS4xOTEuODE2LS40NC4xLjA0NS0uNzUtLjU0NS0uMjE0LS45ODYuMzk0LTEuNDY0LjExOC0uNzA3LjE3Ny0xLjQ5My4xNzctMi4zNjYgMC0uNTg2LS4wNTItMS4xMjgtLjE1Ny0xLjcyNS0uMTA2LS41OTUtLjI1My0xLjEyNi0uNDQ2LTEuNTk0LS4xOTQtLjQ2Ny0uNDE5LS44NjQtLjY3OS0xLjE5MS0uNTc1LS43MjItMS4zODgtMS4yMzUtMi40MzUtMS41NDN2LS4wNEMtLjA4IDQuMDM5IDEuNjA1IDEuODczIDQuOTk4IDEuNDA2VjEuMzhoLjA0MmMuNDI2LS4wODEuODc5LS4xMjIgMS40MjktLjEyMnptLS40MzcgNS43NDZjLS41IDAtLjkyLjE1NS0xLjI2Ny40NzUtLjM0NS4zMi0uNTU0Ljg0LS42MjggMS41NjlsLS4wMTMuMDY1aDMuNjg5di0uMDUyYzAtLjY2OS0uMTc3LTEuMTYtLjUxNy0xLjQ4NC0uMzQtLjMyNi0uNzU0LS40OTctMS4yNDYtLjQ5N2gtLjAxOHptLjQ0NCA0Ljk4NWMtLjEwNiAwLS4yMDMuMDAzLS4yOTUuMDA2LS4wODkuMDA1LS4xNjYuMDA3LS4yMzMuMDA3SDguNDUxbC4wMTQuMDUzYy4wOS43MzQuMzIgMS4yNTcuNjk0IDEuNTcuMzc1LjMxNC44NTUuNDcxIDEuNDQyLjQ3MS41MzQgMCAuOTctLjE0MiAxLjMyLS40My4zNS0uMjg4LjU2LS43NTUuNjUyLTEuNDIzbC4wMTMtLjA1M2gtMS4wODZsLjAyNi0uMjAxaC0uMDRjMCAuMTMzLS4wNjEuMjAxeiIvPjwvc3ZnPg==`,
      color: '#1769FF'
    }
  };

  let iconsHTML = '';
  
  for (const [platform, url] of Object.entries(socialLinks)) {
    if (!url || !iconData[platform]) continue;
    
    let backgroundColor = 'transparent';
    let iconColor = '#000000';
    let padding = '0';
    let borderRadius = '0';
    let svgSource = '';
    
    // Get base64 SVG data
    const iconSvg = iconData[platform].svg;
    const platformColor = iconData[platform].color;
    
    // Set styling based on selected style
    switch (style) {
      case 'color':
        iconColor = platformColor;
        svgSource = `data:image/svg+xml;base64,${iconSvg}`;
        break;
      case 'monochrome':
        iconColor = '#555555';
        // Convert colored SVG to monochrome using a filter in the img style
        svgSource = `data:image/svg+xml;base64,${iconSvg}`;
        break;
      case 'circle':
        backgroundColor = platformColor;
        iconColor = '#FFFFFF';
        padding = '5px';
        borderRadius = '50%';
        svgSource = `data:image/svg+xml;base64,${iconSvg}`;
        break;
      case 'square':
        backgroundColor = platformColor;
        iconColor = '#FFFFFF';
        padding = '5px';
        borderRadius = '4px';
        svgSource = `data:image/svg+xml;base64,${iconSvg}`;
        break;
    }
    
    const sanitizedUrl = sanitizeUrl(url);
    
    iconsHTML += `
      <a href="${sanitizedUrl}" style="display: inline-block; margin-right: 8px; text-decoration: none;" target="_blank">
        <span style="display: inline-flex; align-items: center; justify-content: center; background-color: ${backgroundColor}; border-radius: ${borderRadius}; padding: ${padding};">
          <img src="${svgSource}" alt="${platform}" style="height: 16px; width: 16px; ${style === 'monochrome' ? 'filter: grayscale(100%) brightness(0.4);' : style === 'circle' || style === 'square' ? 'filter: brightness(0) invert(1);' : ''}" border="0">
        </span>
      </a>
    `;
  }
  
  return iconsHTML;
};
