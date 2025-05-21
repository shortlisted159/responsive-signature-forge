
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
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+SW5zdGFncmFtPC90aXRsZT48cGF0aCBkPSJNMTIgMEM4LjczNiAwIDguMzMyLjAxIDcuMDUyLjA2IDUuNzc1LjExIDQuOTA1LjI3OCA0LjE0LjUyNSAzLjM1Ljc4NCAyLjY4MiAxLjE1IDIuMDE0IDEuODIgMS4zNDcgMi40OSAuOTggMy4xNTguNzIyIDMuOTQ3LjQ3IDQuNzIuMzAzIDUuNTkuMjUzIDYuODYuMjA0IDguMTUuMiA4LjU0LjIgMTEuODEzcy4wMDQgMy42Ni4wNTUgNC45NDhjLjA1IDEuMjguMjE4IDIuMTQ3LjQ2NSAyLjkxMy4yNi44Ny42MiAxLjUzNyAxLjI5NiAyLjIxNS42NzYuNjc2IDEuMzMgMS4wNCAxLjk5OCAxLjIuNzUyLjI1NSAxLjYuNDI2IDIuOTMuNDggMS4zMjUuMDQgMS43NTQuMDUgNC45NzUuMDVzMy42NTUtLjAxIDQuOTgtLjA1YzEuMzI1LS4wNTUgMi4xODctLjIyNyAyLjkzLS40OC44MDUtLjI1NyAxLjQ3LS42MiAyLjEyOC0xLjI4NS42NTYtLjY1NyAxLjAyLTEuMzI2IDEuMjgtMi4xMjcuMjUzLS43NDQuNDI0LTEuNjE0LjQ4LTIuOTMuMDQ2LTEuMzEzLjA0Ni0xLjcyNi4wNDYtNC45OTQgMC0zLjI2Ni0uMDA4LTMuNjgyLS4wNTYtNS4wMDctLjA1NS0xLjMtLjIzNS0yLjE2LS40ODUtMi45MDktLjI1Ni0uNzktLjYyLTEuNDc1LTEuMjczLTIuMTI4LS42NTctLjY1Ny0xLjMyLTEuMDItMi4xMjctMS4yNzctLjc0NC0uMjUtMS42MTMtLjQyMy0yLjkzLS40OC0xLjMxMi0uMDQzLTEuNzMyLS4wNTYtNC45OC0uMDU2ek0xMCAyLjE4OGMuMzMgMCAuNzA2IDAgMS4xMzMuMDU3IDEuNDcuMDY2IDIuMDI1LjIxOCAyLjUzLjM2NS42MzMuMTUzIDEuMDkuMzM1IDEuNTc3LjgyLjQ4Ni40ODUuNjYuODkuODE3IDEuNTI0LjE0Ni41MDMuMjk4IDEuMDU3LjM2NiAyLjUyNy4wNyAxLjQ3LjA4NyAxLjkxLjA4NyA1LjUyIDAgMy42MS0uMDIgNC4wNS0uMDkgNS41Mi0uMDggMS40Ny0uMjIgMi4wMi0uMzcgMi41My0uMTYuNi0uMzMgMS4wNi0uODIgMS41NC0uNS40OC0uOTEuNjYtMS41Mi44Mi0uNTEuMTQtMS4wNi4yOC0yLjUzLjM2LTEuNDkuMDctMS45My4wOS01LjU0LjA5LTMuNjEgMC00LjA1LS4wMi01LjUzLS4wOS0xLjQ4LS4wOC0yLjAzLS4yMi0yLjU0LS4zNi0uNi0uMTYtMS4wNi0uMzQtMS41NC0uODItLjQ4LS41LS42Ni0uOTEtLjgyLTEuNTItLjE0LS41MS0uMjgtMS4wNi0uMzYtMi41My0uMDYtMS40LS4wOS0xLjk0LS4wOS01LjUzcy4wMy00LjEzLjA5LTUuNTNjLjA4LTEuNDcuMjItMi4wMi4zNi0yLjUzLjE2LS42LjM0LTEuMDYuODItMS41My40OC0uNDguOS0uNjYgMS41Mi0uODIuNTEtLjE0IDEuMDYtLjI4IDIuNTMtLjM2Ljg1NS0uMDQ2IDEuMTg4LS4wNiAyLjkyNy0uMDZ6bTUuNzcgMS41NGMtMS4xOSAwLTIuMTU2Ljk2Ny0yLjE1NiAyLjE1OCAwIDEuMTkuOTY2IDIuMTUzIDIuMTU2IDIuMTUzIDEuMTg1IDAgMi4xNS0uOTY0IDIuMTUtMi4xNTMgMC0xLjE5LS45NjUtMi4xNTgtMi4xNS0yLjE1OHptLTkuNjU1IDEwLjE0YzAgMy4zMSAyLjY5MiA2IDYuMDI1IDYgMy4zMzIgMCA2LjAyNS0yLjY5IDYuMDI1LTYgMC0zLjMxLTIuNjkzLTYtNi4wMjUtNi0zLjMzMyAwLTYuMDI2IDIuNjktNi4wMjYgNnptMi4xOSAwYzAtMi4xIDEuNzAzLTMuOCAzLjgzNi0zLjggMi4xMzIgMCAzLjgzNiAxLjcgMy44MzYgMy44IDAgMi4xLTEuNzA0IDMuOC0zLjgzNiAzLjgtMi4xMzMgMC0zLjgzNi0xLjctMy44MzYtMy44eiIvPjwvc3ZnPg==`,
      color: '#E4405F'
    },
    github: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViPC90aXRsZT48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+`,
      color: '#181717'
    },
    behance: {
      svg: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcuODAzIDUuNzdoNC4wMzVjLjc3NSAwIDEuNTA3LjE1MyAyLjE5My40NTdzMS4yNjQuNzI5IDEuNzI5IDEuMjcyYy40NjUuNTQ0LjY5NyAxLjIuNjk3IDEuOTcgMCAuNzI4LS4xNyAxLjMyNy0uNTEgMS43OThhMy42MTggMy42MTggMCAwIDEtMS4xMTkgMS4xMDFjLjY3NC4yNTEgMS4xOTQuNjQzIDEuNTYyIDEuMTc3cy41NTEgMS4xNzMuNTUxIDEuOTExYzAgLjc4MS0uMiAxLjQ1NS0uNjAzIDIuMDIzYTMuOTIgMy45MiAwIDAgMS0xLjYzMiAxLjMxNGMtLjY3OS4yOTgtMS40MzkuNDQ3LTIuMjgyLjQ0N0g3LjgwM1Y1Ljc3em0uNjQ4IDUuMTUyaDMuNTU1Yy42NjggMCAxLjIwOC0uMTcxIDEuNjE3LS41MTJzLjYxNi0uODIuNjE2LTEuNDM4YzAtLjYzMy0uMTk2LTEuMTE2LS41OC0xLjQ1My0uMzg2LS4zMzYtLjkxOS0uNTA0LTEuNTk4LS41MDRIOC40NXYzLjkwN3ptMCA1LjI1MWgzLjc3M2MuNzA0IDAgMS4yNy0uMTg0IDEuNjk1LS41NTIuNDI2LS4zNjguNjM5LS45MDUuNjM5LTEuNjEzIDAtLjY1Ny0uMjEyLTEuMTYzLS42MzktMS41MTYtLjQyNi0uMzU0LS45ODItLjUzLTEuNjY4LS41M0g4LjQ1MXYzLjI4MXpNMTYuMTEgMTUuMTloNi42MDZjLjAzMS0uNjk5LS4wMjQtMS4zNy0uMTY0LTIuMDE0YTQuMTA0IDQuMTA0IDAgMCAwLS42MjMtMS41NjJjLS4yOTYtLjQ1Mi0uNjktLjgxNi0xLjE4LTEuMDk1YTMuNTY1IDMuNTY1IDAgMCAwLTEuNjM5LS40MTljLS43NzUgMC0xLjQ1Ny4xNzgtMi4wNDkuNTM0YTMuOTQyIDMuOTQyIDAgMCAwLTEuMzc3IDEuNDIzYy0uMzI2LjU5Ni0uNDkgMS4yNDgtLjQ5IDEuOTYgMCAuNzQ0LjE2NCAxLjQwOC40OSAxLjk5M3MuNzc2IDEuMDQ5IDEuMzUgMS4zODZjLjU3NS4zMzggMS4xOTcuNTA2IDEuODY3LjUwNy45NzYgMCAxLjc5Mi0uMjU4IDIuNDQtLjc3My42NDgtLjUxNiAxLjA1NS0xLjIxMiAxLjIyMS0yLjA4OWgtMi4xNDhjLS4wODEuMzEtLjI1LjU2NS0uNTA4Ljc2L0E0LjgxIDQuODEgMCAwIDEgMTkgMTYuMDNjLS4yNjcuMDUtLjU1LjA3NS0uODQzLjA3NS0uNDk5IDAtLjkxNi0uMDgtMS4yNS0uMjQxLS4zMzQtLjE2LS42LS4zNzQtLjc5Ni0uNjQzYTIuMzkgMi4zOSAwIDAgMS0uNDI1LS44OTFoNi40MjRWMTUuMTl6bS0uMzY4LTEuNzc4aC00LjExNGMuMDIuMzQuMTIyLjY0My4zMDkuOTA5LjE4Ny4yNjYuNDM0LjQ3NC43NDEuNjI2LjMwNy4xNTIuNjYuMjI3IDEuMDYuMjI3LjM4MiAwIC43MTMtLjA3My45OTctLjIxOGEyLjg4IDIuODggMCAwIDAgLjY5Ny0uNTQzYy4xNjUtLjIwNi4yNzktLjQzOC4zNDUtLjY5NmwuMDQtLjEzMmwuMDI0LS4wODNjLjAxLS4wMy4wMTgtLjA2LjAyNC0uMDl6bS0uMDQtNC4zNDlIMjJ2MS42MmgtNC4zMDN2LTEuNjJ6IiBmaWxsPSIjMDA3MEJCII+PC9wYXRoPjwvc3ZnPg==`,
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
